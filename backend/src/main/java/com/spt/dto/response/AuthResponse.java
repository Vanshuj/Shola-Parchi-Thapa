package com.spt.dto.response;

public class AuthResponse {
    private Long userId;
    private String username;
    private String token;

    public AuthResponse(Long userId, String username, String token) {
        this.userId = userId;
        this.username = username;
        this.token = token;
    }

    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getToken() { return token; }
}
