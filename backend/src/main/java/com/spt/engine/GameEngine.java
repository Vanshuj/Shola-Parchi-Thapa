package com.spt.engine;

import com.spt.engine.exception.GameOverException;

import java.time.Instant;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * Orchestrates a single game end-to-end: deal, turn order, passing, win detection.
 * This is the single source of truth for game rules. Pure Java, fully unit-testable
 * without Spring context.
 */
public final class GameEngine {

    private final Random random;

    public GameEngine() {
        this(new SecureRandom());
    }

    public GameEngine(Random random) {
        this.random = random;
    }

    /** Creates a fresh game, deals hands, and starts the first turn. */
    public GameState startNewGame(String gameId, List<Player> players, Instant now) {
        if (players.size() < 2 || players.size() > 4) {
            throw new IllegalArgumentException("A game needs 2-4 players");
        }
        Deck deck = Deck.newShuffledDeck(random);
        List<List<Card>> hands = deck.deal(players.size());
        for (int i = 0; i < players.size(); i++) {
            for (Card c : hands.get(i)) {
                players.get(i).addCard(c);
            }
        }
        GameState state = new GameState(gameId, players);
        state.setStatus(GameState.Status.ACTIVE);
        TurnManager.startTurn(state, 0, now);
        state.logEvent("GAME_STARTED");
        return state;
    }

    /**
     * Applies a pass move: validates, moves the card to the next active seat,
     * checks for a win, and advances the turn if the game continues.
     * Returns the winner if this move ended the game.
     */
    public Optional<Player> pass(GameState state, Long actingUserId, String cardId, Instant now) {
        RuleValidator.validatePass(state, actingUserId, cardId);

        Player current = state.getCurrentPlayer();
        Card card = current.findCard(cardId);
        Player receiver = state.nextActivePlayer(current.getSeatIndex());

        current.removeCard(card);
        receiver.addCard(card);
        state.logEvent("PASS:" + current.getSeatIndex() + "->" + receiver.getSeatIndex() + ":" + card.getId());

        Optional<Player> winner = WinDetector.checkWinner(receiver);
        if (winner.isPresent()) {
            state.setStatus(GameState.Status.FINISHED);
            winner.get().getUserId().ifPresent(state::setWinnerUserId);
            state.logEvent("WIN:" + winner.get().getSeatIndex());
            return winner;
        }

        TurnManager.advance(state, now);
        return Optional.empty();
    }

    /** Called by the scheduler when a turn's 15s clock expires: passes a random card. */
    public Optional<Player> autoPassRandomCard(GameState state, Instant now) {
        if (state.getStatus() != GameState.Status.ACTIVE) {
            throw new GameOverException("Game " + state.getGameId() + " is not active");
        }
        Player current = state.getCurrentPlayer();
        List<Card> hand = current.getHand();
        if (hand.isEmpty()) {
            throw new IllegalStateException("Current player has no cards to auto-pass");
        }
        Card randomCard = hand.get(random.nextInt(hand.size()));
        Long actingUserId = current.getUserId().orElse(null);
        state.logEvent("AUTO_PASS:" + current.getSeatIndex());
        return pass(state, actingUserId, randomCard.getId(), now);
    }

    /** Marks a player forfeited (disconnect grace expired) and skips them permanently. */
    public void forfeit(GameState state, Long userId, Instant now) {
        Player player = state.findByUserId(userId);
        player.setForfeited(true);
        player.setConnected(false);
        state.logEvent("FORFEIT:" + player.getSeatIndex());

        long remaining = state.getPlayers().stream().filter(p -> !p.isForfeited()).count();
        if (remaining <= 1) {
            state.getPlayers().stream()
                    .filter(p -> !p.isForfeited())
                    .findFirst()
                    .ifPresent(last -> {
                        state.setStatus(GameState.Status.FINISHED);
                        last.getUserId().ifPresent(state::setWinnerUserId);
                        state.logEvent("WIN_BY_FORFEIT:" + last.getSeatIndex());
                    });
            return;
        }
        if (state.getCurrentPlayer().equals(player) && state.getStatus() == GameState.Status.ACTIVE) {
            TurnManager.advance(state, now);
        }
    }

    /** Builds ghost (empty-seat) players that auto-pass when reached, to fill a table to 4. */
    List<Player> newGhostSeats(int existing, int total) {
        List<Player> ghosts = new ArrayList<>();
        for (int i = existing; i < total; i++) {
            ghosts.add(new Player(i, null, "Ghost-" + (i + 1)));
        }
        return ghosts;
    }
}
