package com.spt.room;

import com.spt.engine.GameState;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Wraps a live GameState plus everything not part of pure game rules:
 * a lock for serializing concurrent moves, disconnect grace timers, and
 * the room code it was created from.
 */
public class GameRoom {

    private final String roomCode;
    private final GameState state;
    private final ReentrantLock lock = new ReentrantLock();
    private final Map<Long, Instant> disconnectDeadlines = new HashMap<>();

    public GameRoom(String roomCode, GameState state) {
        this.roomCode = roomCode;
        this.state = state;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public GameState getState() {
        return state;
    }

    public ReentrantLock getLock() {
        return lock;
    }

    public void markDisconnected(Long userId, Instant now, java.time.Duration grace) {
        disconnectDeadlines.put(userId, now.plus(grace));
    }

    public void markReconnected(Long userId) {
        disconnectDeadlines.remove(userId);
    }

    public boolean isGraceExpired(Long userId, Instant now) {
        Instant deadline = disconnectDeadlines.get(userId);
        return deadline != null && now.isAfter(deadline);
    }

    public Map<Long, Instant> getDisconnectDeadlines() {
        return disconnectDeadlines;
    }
}
