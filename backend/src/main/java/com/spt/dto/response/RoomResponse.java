package com.spt.dto.response;

import java.util.List;

public class RoomResponse {
    private String roomCode;
    private String status;
    private Long hostUserId;
    private int maxPlayers;
    private boolean isPrivate;
    private List<String> seatedUsernames;
    private String gameId;

    public RoomResponse(String roomCode, String status, Long hostUserId, int maxPlayers,
                         boolean isPrivate, List<String> seatedUsernames, String gameId) {
        this.roomCode = roomCode;
        this.status = status;
        this.hostUserId = hostUserId;
        this.maxPlayers = maxPlayers;
        this.isPrivate = isPrivate;
        this.seatedUsernames = seatedUsernames;
        this.gameId = gameId;
    }

    public String getRoomCode() { return roomCode; }
    public String getStatus() { return status; }
    public Long getHostUserId() { return hostUserId; }
    public int getMaxPlayers() { return maxPlayers; }
    public boolean isPrivate() { return isPrivate; }
    public List<String> getSeatedUsernames() { return seatedUsernames; }
    public String getGameId() { return gameId; }
}
