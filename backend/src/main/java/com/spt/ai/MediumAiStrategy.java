package com.spt.ai;

import com.spt.engine.Card;
import com.spt.engine.CardType;
import com.spt.engine.GameState;
import com.spt.engine.Player;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Keeps the majority type in hand (the type it holds the most of), and
 * passes away a card from whichever type it holds the least of. Ties are
 * broken by hand order for determinism.
 */
public class MediumAiStrategy implements AiStrategy {

    @Override
    public Card chooseCardToPass(Player me, GameState state) {
        List<Card> hand = me.getHand();
        if (hand.isEmpty()) {
            throw new IllegalStateException("AI has no cards");
        }
        Map<CardType, Integer> counts = new EnumMap<>(CardType.class);
        for (Card c : hand) {
            counts.merge(c.getType(), 1, Integer::sum);
        }
        CardType leastHeldType = null;
        int leastCount = Integer.MAX_VALUE;
        for (Card c : hand) {
            int count = counts.get(c.getType());
            if (count < leastCount) {
                leastCount = count;
                leastHeldType = c.getType();
            }
        }
        final CardType toDiscard = leastHeldType;
        return hand.stream()
                .filter(c -> c.getType() == toDiscard)
                .findFirst()
                .orElse(hand.get(0));
    }
}
