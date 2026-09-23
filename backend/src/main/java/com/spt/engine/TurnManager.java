package com.spt.engine;

import java.time.Duration;
import java.time.Instant;

/** Advances turns and manages the 15s turn-deadline clock. Pure Java, no scheduling. */
public final class TurnManager {

    public static final Duration TURN_DURATION = Duration.ofSeconds(15);

    private TurnManager() {
    }

    public static void startTurn(GameState state, int seatIndex, Instant now) {
        state.setCurrentTurnIndex(seatIndex);
        state.setTurnDeadline(now.plus(TURN_DURATION));
        state.incrementTurnNumber();
    }

    public static void advance(GameState state, Instant now) {
        Player next = state.nextActivePlayer(state.getCurrentTurnIndex());
        startTurn(state, next.getSeatIndex(), now);
    }

    public static boolean isExpired(GameState state, Instant now) {
        return state.getTurnDeadline() != null && now.isAfter(state.getTurnDeadline());
    }
}
