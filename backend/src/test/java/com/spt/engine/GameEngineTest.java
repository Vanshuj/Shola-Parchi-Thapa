package com.spt.engine;

import com.spt.engine.exception.InvalidCardException;
import com.spt.engine.exception.NotYourTurnException;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class GameEngineTest {

    private List<Player> fourPlayers() {
        return new java.util.ArrayList<>(List.of(
                new Player(0, 1L, "a"), new Player(1, 2L, "b"),
                new Player(2, 3L, "c"), new Player(3, 4L, "d")));
    }

    @Test
    void startNewGame_dealsFourCardsToEachPlayer() {
        GameEngine engine = new GameEngine(new Random(7));
        GameState state = engine.startNewGame("g1", fourPlayers(), Instant.now());
        state.getPlayers().forEach(p -> assertEquals(4, p.getHand().size()));
        assertEquals(GameState.Status.ACTIVE, state.getStatus());
        assertEquals(0, state.getCurrentTurnIndex());
    }

    @Test
    void pass_movesCardAndAdvancesTurn_whenNoWin() {
        GameEngine engine = new GameEngine(new Random(7));
        GameState state = engine.startNewGame("g1", fourPlayers(), Instant.now());
        Player current = state.getCurrentPlayer();
        String cardId = current.getHand().get(0).getId();

        Optional<Player> winner = engine.pass(state, current.getUserId().get(), cardId, Instant.now());

        assertTrue(winner.isEmpty());
        assertEquals(3, current.getHand().size());
        assertEquals(1, state.getCurrentTurnIndex());
    }

    @Test
    void pass_rejectsWrongPlayer() {
        GameEngine engine = new GameEngine(new Random(7));
        GameState state = engine.startNewGame("g1", fourPlayers(), Instant.now());
        Player notCurrent = state.getPlayers().get(1);
        String cardId = notCurrent.getHand().get(0).getId();

        assertThrows(NotYourTurnException.class,
                () -> engine.pass(state, notCurrent.getUserId().get(), cardId, Instant.now()));
    }

    @Test
    void pass_rejectsCardNotInHand() {
        GameEngine engine = new GameEngine(new Random(7));
        GameState state = engine.startNewGame("g1", fourPlayers(), Instant.now());
        Player current = state.getCurrentPlayer();

        assertThrows(InvalidCardException.class,
                () -> engine.pass(state, current.getUserId().get(), "not-a-real-card", Instant.now()));
    }

    @Test
    void pass_declaresWinner_whenReceiverGetsFourOfAKind() {
        // Rig a 2-player state where player 1 already holds 3 of TYPE_1 and receives a 4th.
        Player p0 = new Player(0, 1L, "a");
        Player p1 = new Player(1, 2L, "b");
        p0.addCard(new Card("x1", CardType.TYPE_1));
        p0.addCard(new Card("x2", CardType.TYPE_2));
        p0.addCard(new Card("x3", CardType.TYPE_3));
        p0.addCard(new Card("x4", CardType.TYPE_4));
        p1.addCard(new Card("y1", CardType.TYPE_1));
        p1.addCard(new Card("y2", CardType.TYPE_1));
        p1.addCard(new Card("y3", CardType.TYPE_1));
        p1.addCard(new Card("y4", CardType.TYPE_2));

        GameState state = new GameState("g2", new java.util.ArrayList<>(List.of(p0, p1)));
        state.setStatus(GameState.Status.ACTIVE);
        TurnManager.startTurn(state, 0, Instant.now());

        GameEngine engine = new GameEngine(new Random(1));
        Optional<Player> winner = engine.pass(state, 1L, "x1", Instant.now());

        assertTrue(winner.isPresent());
        assertEquals(2L, winner.get().getUserId().get());
        assertEquals(GameState.Status.FINISHED, state.getStatus());
        assertEquals(2L, state.getWinnerUserId());
    }

    @Test
    void autoPassRandomCard_passesSomeCardFromCurrentPlayer() {
        GameEngine engine = new GameEngine(new Random(3));
        GameState state = engine.startNewGame("g3", fourPlayers(), Instant.now());
        int before = state.getCurrentPlayer().getHand().size();
        Player currentBeforePass = state.getCurrentPlayer();

        engine.autoPassRandomCard(state, Instant.now());

        assertEquals(before - 1, currentBeforePass.getHand().size());
    }

    @Test
    void forfeit_endsGameWhenOnlyOnePlayerRemains() {
        List<Player> players = new java.util.ArrayList<>(List.of(new Player(0, 1L, "a"), new Player(1, 2L, "b")));
        GameState state = new GameState("g4", players);
        state.setStatus(GameState.Status.ACTIVE);
        TurnManager.startTurn(state, 0, Instant.now());

        GameEngine engine = new GameEngine(new Random(1));
        engine.forfeit(state, 1L, Instant.now());

        assertEquals(GameState.Status.FINISHED, state.getStatus());
        assertEquals(2L, state.getWinnerUserId());
    }
}
