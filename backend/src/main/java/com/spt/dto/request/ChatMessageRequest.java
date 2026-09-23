package com.spt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChatMessageRequest {

    @NotBlank
    @Size(max = 280)
    private String text;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
