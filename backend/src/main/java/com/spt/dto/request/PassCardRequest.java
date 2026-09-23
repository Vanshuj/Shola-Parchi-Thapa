package com.spt.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PassCardRequest {

    @NotBlank
    private String cardId;

    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }
}
