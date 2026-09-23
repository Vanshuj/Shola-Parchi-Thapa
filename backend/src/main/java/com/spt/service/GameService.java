package com.spt.service;

import com.spt.dto.response.CardDTO;
import com.spt.dto.response.GameStateDTO;
import com.spt.dto.response.OpponentDTO;
import com.spt.engine.Card;
import com.spt.engine.GameEngine;
import com.spt.engine.GameState;
import com.spt.engine.Player;
import com.spt.entity.Game;
import com.spt.entity.Match;
import com.spt.entity.Move;
import com.spt.entity.User;
import com.spt.exception.NotFoundException;
import com.spt.repository.GameRepository;
import com.spt.repository.MatchRepository;
import com.spt.repository.MoveRepository;
import com.spt.repository.UserRepository;
import com.spt.room.GameRoom;
import com.spt.room.RoomRegistry;
import com.spt.room.TurnScheduler;
import jakarta.annotation.PostConstruct;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Application-level orchestration around GameEngine: wires the pure engine
 * to persistence, per-recipient DTO projection, and WebSocket broadcast.
 */
@Service
public class GameService {

    public static final Duration DISCONNECT_GRACE = Duration.ofSeconds(30);

    private final GameEngine engine = new GameEngine();
    private final RoomRegistry roomRegistry;
    private final TurnScheduler turnScheduler;
    private final GameRepository gameRepository;
    private final MoveRepository moveRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final CardLabelService cardLabelService;
    private final SimpMessagingTemplate messagingTemplate;

    public GameService(RoomRegistry roomRegistry, TurnScheduler turnScheduler, GameRepository gameRepository,
                        MoveRepository moveRepository, MatchRepository matchRepository,
                        UserRepository userRepository, CardLabelService cardLabelService,
                        SimpMessagingTemplate messagingTemplate) {
        this.roomRegistry = roomRegistry;
        this.turnScheduler = turnScheduler;
        this.gameRepository = gameRepository;
        this.moveRepository = moveRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.cardLabelService = cardLabelService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostConstruct
    void wireScheduler() {
        turnScheduler.setOnAutoPass((room, state) -> {
            engine.autoPassRandomCard(state, Instant.now())
                    .ifPresentOrElse(winner -> finishGame(room, winner), () -> broadcastState(room));
        });
        turnScheduler.setOnForfeit((room, userId) -> {
            engine.forfeit(room.getState(), userId, Instant.now());
            room.markReconnected(userId);
            if (room.getState().getStatus() == GameState.Status.FINISHED) {
                persistFinish(room);
            }
            broadcastState(room);
        });
    }

    /** Starts a game for the given seated userIds (in seat order) and registers the live room. */
    @Transactional
    public String startGame(String roomCode, List<Long> seatedUserIds) {
        Game game = gameRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new NotFoundException("ROOM_NOT_FOUND", "No room with code " + roomCode));

        List<Player> players = new ArrayList<>();
        int seat = 0;
        for (Long userId : seatedUserIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found"));
            players.add(new Player(seat++, userId, user.getUsername()));
        }
        // Fill remaining seats up to maxPlayers with ghost (auto-pass) seats.
        while (players.size() < game.getMaxPlayers() && players.size() < 4) {
            players.add(new Player(seat++, null, "Ghost-" + seat));
        }

        String gameId = game.getId().toString();
        GameState state = engine.startNewGame(gameId, players, Instant.now());
        GameRoom room = new GameRoom(roomCode, state);
        roomRegistry.register(room);

        game.setStatus("ACTIVE");
        gameRepository.save(game);
        broadcastState(room);
        return gameId;
    }

    @Transactional
    public void pass(String gameId, Long userId, String cardId) {
        GameRoom room = findRoomOrThrow(gameId);
        room.getLock().lock();
        try {
            GameState state = room.getState();
            int turnBefore = state.getTurnNumber();
            Player actor = state.findByUserId(userId);
            String cardType = actor.findCard(cardId).getType().name();

            Optional<Player> winner = engine.pass(state, userId, cardId, Instant.now());

            Move move = new Move();
            move.setGameId(UUID.fromString(gameId));
            move.setTurnNumber(turnBefore);
            move.setPlayerId(userId);
            move.setPassedCardType(cardType);
            moveRepository.save(move);

            if (winner.isPresent()) {
                finishGame(room, winner.get());
            } else {
                broadcastState(room);
            }
        } finally {
            room.getLock().unlock();
        }
    }

    public void handleDisconnect(String gameId, Long userId) {
        findRoomOrThrow(gameId).markDisconnected(userId, Instant.now(), DISCONNECT_GRACE);
    }

    public void handleReconnect(String gameId, Long userId) {
        GameRoom room = findRoomOrThrow(gameId);
        room.markReconnected(userId);
        GameStateDTO dto = buildDtoFor(room.getState(), userId);
        messagingTemplate.convertAndSend("/topic/game/" + gameId + "/for/" + userId, dto);
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/game/" + gameId, dto);
    }

    private void finishGame(GameRoom room, Player winner) {
        room.getState().setStatus(GameState.Status.FINISHED);
        winner.getUserId().ifPresent(room.getState()::setWinnerUserId);
        persistFinish(room);
        broadcastState(room);
    }

    @Transactional
    protected void persistFinish(GameRoom room) {
        GameState state = room.getState();
        gameRepository.findById(UUID.fromString(state.getGameId())).ifPresent(game -> {
            game.setStatus("FINISHED");
            game.setFinishedAt(Instant.now());
            gameRepository.save(game);
        });
        int rank = 1;
        List<Player> ranked = new ArrayList<>(state.getPlayers());
        ranked.sort((a, b) -> Boolean.compare(b.hasWinningHand(), a.hasWinningHand()));
        for (Player p : ranked) {
            if (p.isGhost()) continue;
            Long userId = p.getUserId().orElseThrow();
            Match match = new Match();
            match.setGameId(UUID.fromString(state.getGameId()));
            match.setUserId(userId);
            match.setRank(rank++);
            matchRepository.save(match);
            userRepository.findById(userId).ifPresent(user -> {
                if (userId.equals(state.getWinnerUserId())) {
                    user.setWins(user.getWins() + 1);
                    user.setEloRating(user.getEloRating() + 15);
                } else {
                    user.setLosses(user.getLosses() + 1);
                    user.setEloRating(Math.max(0, user.getEloRating() - 5));
                }
                userRepository.save(user);
            });
        }
    }

    private void broadcastState(GameRoom room) {
        GameState state = room.getState();
        // Dispatch public spectator projection first
        messagingTemplate.convertAndSend("/topic/game/" + state.getGameId(), buildDtoFor(state, null));

        // Dispatch authoritative per-player hand states second
        for (Player player : state.getPlayers()) {
            if (player.isGhost()) continue;
            Long userId = player.getUserId().orElseThrow();
            GameStateDTO dto = buildDtoFor(state, userId);
            messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/game/" + state.getGameId(), dto);
            messagingTemplate.convertAndSend("/topic/game/" + state.getGameId() + "/for/" + userId, dto);
        }
    }

    /** Builds the per-recipient projection. viewerUserId=null yields a spectator/public view with no hand. */
    public GameStateDTO buildDtoFor(GameState state, Long viewerUserId) {
        Map<String, String> myLabels = viewerUserId == null ? Map.of() : cardLabelService.getLabels(viewerUserId);
        List<CardDTO> yourHand = new ArrayList<>();
        List<OpponentDTO> opponents = new ArrayList<>();

        for (Player p : state.getPlayers()) {
            boolean isViewer = viewerUserId != null && p.getUserId().map(viewerUserId::equals).orElse(false);
            if (isViewer) {
                for (Card c : p.getHand()) {
                    yourHand.add(new CardDTO(c.getId(), c.getType().name(),
                            myLabels.getOrDefault(c.getType().name(), c.getType().name())));
                }
            } else {
                Long oppId = p.isGhost() ? (long) (-p.getSeatIndex() - 1) : p.getUserId().orElse(null);
                opponents.add(new OpponentDTO(oppId, p.getUsername(), p.getHand().size()));
            }
        }

        Player current = state.getCurrentPlayer();
        Long currentTurnPlayerId = current.isGhost()
                ? (long) (-current.getSeatIndex() - 1)
                : current.getUserId().orElse(null);

        return new GameStateDTO(
                state.getGameId(),
                room(state).map(GameRoom::getRoomCode).orElse(""),
                state.getStatus().name(),
                currentTurnPlayerId,
                state.getTurnDeadline(),
                state.getTurnNumber(),
                yourHand,
                opponents,
                state.getWinnerUserId()
        );
    }

    public GameStateDTO getStateFor(String gameId, Long userId) {
        GameRoom room = findRoomOrThrow(gameId);
        return buildDtoFor(room.getState(), userId);
    }

    public List<Move> getHistory(String gameId) {
        return moveRepository.findByGameIdOrderByTurnNumberAsc(UUID.fromString(gameId));
    }

    private Optional<GameRoom> room(GameState state) {
        return roomRegistry.findByGameId(state.getGameId());
    }

    private GameRoom findRoomOrThrow(String gameId) {
        return roomRegistry.findByGameId(gameId)
                .orElseThrow(() -> new NotFoundException("ROOM_NOT_FOUND", "No live game " + gameId));
    }
}
