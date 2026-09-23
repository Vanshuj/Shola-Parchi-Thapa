package com.spt.dto.response;

import java.time.Instant;

public class LabelResponse {
    private String cardType;
    private String label;
    private Instant updatedAt;

    public LabelResponse(String cardType, String label, Instant updatedAt) {
        this.cardType = cardType;
        this.label = label;
        this.updatedAt = updatedAt;
    }

    public String getCardType() { return cardType; }
    public String getLabel() { return label; }
    public Instant getUpdatedAt() { return updatedAt; }
}
