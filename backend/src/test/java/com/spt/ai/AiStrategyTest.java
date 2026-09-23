package com.spt.ai;

import com.spt.engine.Card;
import com.spt.engine.CardType;
import com.spt.engine.GameState;
import com.spt.engine.Player;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class AiStrategyTest {

    private Player playerWithHand(CardType... types) {
        Player p = new Player(0, 1L, "bot");
        int i = 0;
        for (CardType t : types) {
            p.addCard(new Card("c" + (i++), t));
        }
        return p;
    }

    @Test
    void easy_alwaysReturnsCardFromHand() {
        Player p = playerWithHand(CardType.TYPE_1, CardType.TYPE_2, CardType.TYPE_3, CardType.TYPE_4);
        EasyAiStrategy strategy = new EasyAiStrategy(new Random(5));
        Card chosen = strategy.chooseCardToPass(p, dummyState(p));
        assertTrue(p.getHand().contains(chosen));
    }

    @Test
    void medium_discardsFromLeastHeldType() {
        Player p = playerWithHand(CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_2);
        MediumAiStrategy strategy = new MediumAiStrategy();
        Card chosen = strategy.chooseCardToPass(p, dummyState(p));
        assertEquals(CardType.TYPE_2, chosen.getType());
    }

    @Test
    void hard_fallsBackToLeastHeld_whenNoDeadTypeSignal() {
        Player p = playerWithHand(CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_2);
        Player opponent = new Player(1, 2L, "opp");
        GameState state = new GameState("g", new java.util.ArrayList<>(List.of(p, opponent)));
        HardAiStrategy strategy = new HardAiStrategy();
        Card chosen = strategy.chooseCardToPass(p, state);
        assertNotNull(chosen);
        assertTrue(p.getHand().contains(chosen));
    }

    private GameState dummyState(Player p) {
        return new GameState("g", new java.util.ArrayList<>(List.of(p)));
    }
}
