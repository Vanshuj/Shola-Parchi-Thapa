package com.spt.dto.response;

import java.time.Instant;
import java.util.List;

/**
 * Player-specific projection of GameState. CRITICAL: yourHand carries only the
 * requesting player's own custom labels; opponents never expose labels or hands
 * (see OpponentDTO). GameService builds a fresh instance per recipient.
 */
public class GameStateDTO {
    private String gameId;
    private String roomCode;
    private String status;
    private Long currentTurnPlayerId;
    private Instant turnDeadline;
    private int turnNumber;
    private List<CardDTO> yourHand;
    private List<OpponentDTO> opponents;
    private Long winnerId;

    public GameStateDTO(String gameId, String roomCode, String status, Long currentTurnPlayerId,
                         Instant turnDeadline, int turnNumber, List<CardDTO> yourHand,
                         List<OpponentDTO> opponents, Long winnerId) {
        this.gameId = gameId;
        this.roomCode = roomCode;
        this.status = status;
        this.currentTurnPlayerId = currentTurnPlayerId;
        this.turnDeadline = turnDeadline;
        this.turnNumber = turnNumber;
        this.yourHand = yourHand;
        this.opponents = opponents;
        this.winnerId = winnerId;
    }

    public String getGameId() { return gameId; }
    public String getRoomCode() { return roomCode; }
    public String getStatus() { return status; }
    public Long getCurrentTurnPlayerId() { return currentTurnPlayerId; }
    public Instant getTurnDeadline() { return turnDeadline; }
    public int getTurnNumber() { return turnNumber; }
    public List<CardDTO> getYourHand() { return yourHand; }
    public List<OpponentDTO> getOpponents() { return opponents; }
    public Long getWinnerId() { return winnerId; }
}
