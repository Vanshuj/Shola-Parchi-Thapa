package com.spt.dto.response;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private int eloRating;
    private int wins;
    private int losses;

    public UserResponse(Long id, String username, String email, int eloRating, int wins, int losses) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.eloRating = eloRating;
        this.wins = wins;
        this.losses = losses;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public int getEloRating() { return eloRating; }
    public int getWins() { return wins; }
    public int getLosses() { return losses; }
}
