package com.spt.room;

import com.spt.engine.GameState;
import com.spt.engine.TurnManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

/**
 * Polls all live rooms once a second to enforce the 15s turn timer and the
 * 30s disconnect-forfeit grace period. Callbacks are wired by GameService so
 * this class stays free of WebSocket/broadcast concerns.
 */
@Component
public class TurnScheduler {

    private final RoomRegistry registry;
    private volatile BiConsumer<GameRoom, GameState> onAutoPass = (r, s) -> {};
    private volatile BiConsumer<GameRoom, Long> onForfeit = (r, id) -> {};

    public TurnScheduler(RoomRegistry registry) {
        this.registry = registry;
    }

    public void setOnAutoPass(BiConsumer<GameRoom, GameState> callback) {
        this.onAutoPass = callback;
    }

    public void setOnForfeit(BiConsumer<GameRoom, Long> callback) {
        this.onForfeit = callback;
    }

    @Scheduled(fixedRate = 1000)
    public void tick() {
        Instant now = Instant.now();
        for (GameRoom room : registry.allRooms()) {
            if (room.getState().getStatus() != GameState.Status.ACTIVE) {
                continue;
            }
            room.getLock().lock();
            try {
                if (TurnManager.isExpired(room.getState(), now) || room.getState().getCurrentPlayer().isGhost()) {
                    onAutoPass.accept(room, room.getState());
                }
                room.getDisconnectDeadlines().keySet().stream().toList().forEach(userId -> {
                    if (room.isGraceExpired(userId, now)) {
                        onForfeit.accept(room, userId);
                    }
                });
            } finally {
                room.getLock().unlock();
            }
        }
    }
}
