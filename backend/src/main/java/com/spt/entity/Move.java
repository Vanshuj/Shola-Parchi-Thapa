package com.spt.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "moves")
public class Move {

    @Id
    private String id;

    @Indexed
    private UUID gameId;

    private int turnNumber;

    private Long playerId;

    private String passedCardType;

    private Instant timestamp = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public UUID getGameId() { return gameId; }
    public void setGameId(UUID gameId) { this.gameId = gameId; }

    public int getTurnNumber() { return turnNumber; }
    public void setTurnNumber(int turnNumber) { this.turnNumber = turnNumber; }

    public Long getPlayerId() { return playerId; }
    public void setPlayerId(Long playerId) { this.playerId = playerId; }

    public String getPassedCardType() { return passedCardType; }
    public void setPassedCardType(String passedCardType) { this.passedCardType = passedCardType; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
