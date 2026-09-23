package com.spt.ai;

import com.spt.engine.Card;
import com.spt.engine.GameState;
import com.spt.engine.Player;

import java.util.List;
import java.util.Random;

/** Picks a uniformly random card from hand. No strategy at all. */
public class EasyAiStrategy implements AiStrategy {

    private final Random random;

    public EasyAiStrategy() {
        this(new Random());
    }

    public EasyAiStrategy(Random random) {
        this.random = random;
    }

    @Override
    public Card chooseCardToPass(Player me, GameState state) {
        List<Card> hand = me.getHand();
        if (hand.isEmpty()) {
            throw new IllegalStateException("AI has no cards");
        }
        return hand.get(random.nextInt(hand.size()));
    }
}
