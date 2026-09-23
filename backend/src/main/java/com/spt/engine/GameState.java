package com.spt.engine;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Full authoritative state of one game. Mutated only through GameEngine.
 * Pure Java: holds no Spring/JPA concerns.
 */
public final class GameState {

    public enum Status { WAITING, ACTIVE, FINISHED }

    private final String gameId;
    private final List<Player> players;
    private Status status = Status.WAITING;
    private int currentTurnIndex = 0;
    private int turnNumber = 0;
    private Instant turnDeadline;
    private Long winnerUserId;
    private final List<String> eventLog = new ArrayList<>();

    public GameState(String gameId, List<Player> players) {
        this.gameId = gameId;
        this.players = players;
    }

    public String getGameId() {
        return gameId;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getCurrentTurnIndex() {
        return currentTurnIndex;
    }

    public void setCurrentTurnIndex(int currentTurnIndex) {
        this.currentTurnIndex = currentTurnIndex;
    }

    public Player getCurrentPlayer() {
        return players.get(currentTurnIndex);
    }

    public int getTurnNumber() {
        return turnNumber;
    }

    public void incrementTurnNumber() {
        turnNumber++;
    }

    public Instant getTurnDeadline() {
        return turnDeadline;
    }

    public void setTurnDeadline(Instant turnDeadline) {
        this.turnDeadline = turnDeadline;
    }

    public Long getWinnerUserId() {
        return winnerUserId;
    }

    public void setWinnerUserId(Long winnerUserId) {
        this.winnerUserId = winnerUserId;
    }

    public List<String> getEventLog() {
        return eventLog;
    }

    public void logEvent(String event) {
        eventLog.add(event);
    }

    public Player nextActivePlayer(int fromIndex) {
        int size = players.size();
        for (int step = 1; step <= size; step++) {
            Player candidate = players.get((fromIndex + step) % size);
            if (!candidate.isForfeited()) {
                return candidate;
            }
        }
        throw new IllegalStateException("No active players remain");
    }

    public Player findByUserId(Long userId) {
        return players.stream()
                .filter(p -> p.getUserId().map(id -> id.equals(userId)).orElse(false))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Player not found for user " + userId));
    }
}
