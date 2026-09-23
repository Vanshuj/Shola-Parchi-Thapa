package com.spt.dto.response;

public class LeaderboardEntryResponse {
    private int rank;
    private String username;
    private int eloRating;
    private int wins;
    private int losses;

    public LeaderboardEntryResponse(int rank, String username, int eloRating, int wins, int losses) {
        this.rank = rank;
        this.username = username;
        this.eloRating = eloRating;
        this.wins = wins;
        this.losses = losses;
    }

    public int getRank() { return rank; }
    public String getUsername() { return username; }
    public int getEloRating() { return eloRating; }
    public int getWins() { return wins; }
    public int getLosses() { return losses; }
}
