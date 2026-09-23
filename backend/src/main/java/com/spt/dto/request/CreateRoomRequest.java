package com.spt.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class CreateRoomRequest {

    @Min(2)
    @Max(4)
    private int maxPlayers = 4;

    private boolean isPrivate = true;

    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean aPrivate) { isPrivate = aPrivate; }
}
