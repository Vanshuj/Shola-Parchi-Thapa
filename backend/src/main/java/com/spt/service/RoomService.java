package com.spt.service;

import com.spt.dto.request.CreateRoomRequest;
import com.spt.dto.response.RoomResponse;
import com.spt.entity.Game;
import com.spt.exception.ConflictException;
import com.spt.exception.NotFoundException;
import com.spt.repository.GameRepository;
import com.spt.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RoomService {

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    // roomCode -> ordered seat list of userIds waiting in lobby (not yet dealt)
    private final Map<String, List<Long>> seatedUsers = new ConcurrentHashMap<>();

    public RoomService(GameRepository gameRepository, UserRepository userRepository) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RoomResponse createRoom(Long hostUserId, CreateRoomRequest request) {
        String code = generateUniqueCode();
        Game game = new Game();
        game.setRoomCode(code);
        game.setStatus("WAITING");
        game.setHostUserId(hostUserId);
        game.setMaxPlayers(request.getMaxPlayers());
        game.setPrivate(request.isPrivate());
        gameRepository.save(game);
        seatedUsers.put(code, new ArrayList<>(List.of(hostUserId)));
        return toResponse(game);
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoom(String code) {
        Game game = findGameOrThrow(code);
        return toResponse(game);
    }

    @Transactional
    public RoomResponse join(String code, Long userId) {
        Game game = findGameOrThrow(code);
        if (!"WAITING".equals(game.getStatus())) {
            throw new ConflictException("ROOM_EXPIRED", "Room is no longer accepting players");
        }
        List<Long> seats = seatedUsers.computeIfAbsent(code, k -> new ArrayList<>());
        if (seats.contains(userId)) {
            return toResponse(game);
        }
        if (seats.size() >= game.getMaxPlayers()) {
            throw new ConflictException("ROOM_FULL", "Room is full");
        }
        seats.add(userId);
        return toResponse(game);
    }

    @Transactional
    public void leave(String code, Long userId) {
        Game game = findGameOrThrow(code);
        List<Long> seats = seatedUsers.get(code);
        if (seats != null) {
            seats.remove(userId);
        }
    }

    public List<Long> getSeatedUserIds(String code) {
        return seatedUsers.getOrDefault(code, List.of());
    }

    public Game findGameOrThrow(String code) {
        return gameRepository.findByRoomCode(code)
                .orElseThrow(() -> new NotFoundException("ROOM_NOT_FOUND", "No room with code " + code));
    }

    @Transactional
    public void markActive(Game game) {
        game.setStatus("ACTIVE");
        gameRepository.save(game);
    }

    private String generateUniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (gameRepository.existsByRoomCode(code));
        return code;
    }

    private RoomResponse toResponse(Game game) {
        List<Long> seats = seatedUsers.getOrDefault(game.getRoomCode(), List.of());
        List<String> usernames = new ArrayList<>();
        Map<Long, String> nameCache = new LinkedHashMap<>();
        for (Long id : seats) {
            String name = nameCache.computeIfAbsent(id, uid ->
                    userRepository.findById(uid).map(u -> u.getUsername()).orElse("Player"));
            usernames.add(name);
        }
        String gameId = "ACTIVE".equals(game.getStatus()) || "FINISHED".equals(game.getStatus())
                ? game.getId().toString() : null;
        return new RoomResponse(game.getRoomCode(), game.getStatus(), game.getHostUserId(),
                game.getMaxPlayers(), game.isPrivate(), usernames, gameId);
    }
}
