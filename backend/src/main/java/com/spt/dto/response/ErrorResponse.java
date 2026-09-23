package com.spt.dto.response;

import java.time.Instant;

public class ErrorResponse {
    private String code;
    private String message;
    private Instant timestamp = Instant.now();

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getCode() { return code; }
    public String getMessage() { return message; }
    public Instant getTimestamp() { return timestamp; }
}
