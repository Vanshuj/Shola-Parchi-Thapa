package com.spt.room;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/** In-memory registry of live GameRooms, keyed by gameId and by roomCode. */
@Component
public class RoomRegistry {

    private final Map<String, GameRoom> byGameId = new ConcurrentHashMap<>();
    private final Map<String, String> roomCodeToGameId = new ConcurrentHashMap<>();

    public void register(GameRoom room) {
        byGameId.put(room.getState().getGameId(), room);
        roomCodeToGameId.put(room.getRoomCode(), room.getState().getGameId());
    }

    public Optional<GameRoom> findByGameId(String gameId) {
        return Optional.ofNullable(byGameId.get(gameId));
    }

    public Optional<GameRoom> findByRoomCode(String roomCode) {
        String gameId = roomCodeToGameId.get(roomCode);
        return gameId == null ? Optional.empty() : findByGameId(gameId);
    }

    public void remove(String gameId) {
        GameRoom room = byGameId.remove(gameId);
        if (room != null) {
            roomCodeToGameId.remove(room.getRoomCode());
        }
    }

    public java.util.Collection<GameRoom> allRooms() {
        return byGameId.values();
    }
}
