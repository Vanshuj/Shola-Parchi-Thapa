package com.spt.dto.response;

public class OpponentDTO {
    private Long id;
    private String username;
    private int cardCount;
    private String lastPassed = "HIDDEN";

    public OpponentDTO(Long id, String username, int cardCount) {
        this.id = id;
        this.username = username;
        this.cardCount = cardCount;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public int getCardCount() { return cardCount; }
    public String getLastPassed() { return lastPassed; }
}
