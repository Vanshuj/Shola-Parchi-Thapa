package com.spt.engine;

import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TurnManagerTest {

    private GameState newState() {
        List<Player> players = List.of(
                new Player(0, 1L, "a"), new Player(1, 2L, "b"),
                new Player(2, 3L, "c"), new Player(3, 4L, "d"));
        return new GameState("g1", players);
    }

    @Test
    void startTurn_setsDeadline15SecondsOut() {
        GameState state = newState();
        Instant now = Instant.parse("2026-01-01T00:00:00Z");
        TurnManager.startTurn(state, 1, now);
        assertEquals(1, state.getCurrentTurnIndex());
        assertEquals(now.plusSeconds(15), state.getTurnDeadline());
        assertEquals(1, state.getTurnNumber());
    }

    @Test
    void advance_movesToNextActiveSeat_skippingForfeited() {
        GameState state = newState();
        state.getPlayers().get(1).setForfeited(true);
        Instant now = Instant.now();
        TurnManager.startTurn(state, 0, now);
        TurnManager.advance(state, now);
        assertEquals(2, state.getCurrentTurnIndex());
    }

    @Test
    void isExpired_trueOnlyAfterDeadline() {
        GameState state = newState();
        Instant now = Instant.parse("2026-01-01T00:00:00Z");
        TurnManager.startTurn(state, 0, now);
        assertFalse(TurnManager.isExpired(state, now.plusSeconds(14)));
        assertTrue(TurnManager.isExpired(state, now.plusSeconds(16)));
    }
}
