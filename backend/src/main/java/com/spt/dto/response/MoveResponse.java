package com.spt.dto.response;

import java.time.Instant;

public class MoveResponse {
    private int turnNumber;
    private Long playerId;
    private String passedCardType;
    private Instant timestamp;

    public MoveResponse(int turnNumber, Long playerId, String passedCardType, Instant timestamp) {
        this.turnNumber = turnNumber;
        this.playerId = playerId;
        this.passedCardType = passedCardType;
        this.timestamp = timestamp;
    }

    public int getTurnNumber() { return turnNumber; }
    public Long getPlayerId() { return playerId; }
    public String getPassedCardType() { return passedCardType; }
    public Instant getTimestamp() { return timestamp; }
}
