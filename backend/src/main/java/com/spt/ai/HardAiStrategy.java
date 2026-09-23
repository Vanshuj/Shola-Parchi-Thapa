package com.spt.ai;

import com.spt.engine.Card;
import com.spt.engine.CardType;
import com.spt.engine.GameState;
import com.spt.engine.Player;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Medium strategy plus basic card counting: prefers to pass from a type that
 * looks "dead" (i.e. this AI plus what it can infer from opponents' visible
 * card counts suggests few of that type remain reachable), falling back to
 * Medium's least-held heuristic when counting gives no edge.
 */
public class HardAiStrategy implements AiStrategy {

    private final MediumAiStrategy fallback = new MediumAiStrategy();

    @Override
    public Card chooseCardToPass(Player me, GameState state) {
        List<Card> hand = me.getHand();
        if (hand.isEmpty()) {
            throw new IllegalStateException("AI has no cards");
        }

        Map<CardType, Integer> myCounts = new EnumMap<>(CardType.class);
        for (Card c : hand) {
            myCounts.merge(c.getType(), 1, Integer::sum);
        }

        // A type is "dead" for this AI if it holds exactly 1 of it and the
        // remaining 3 of that type are spread thin across many opponents
        // (approximated here by total distinct opponent seats still in play),
        // making a 4-of-a-kind on that type unlikely before it cycles back.
        long activeOpponents = state.getPlayers().stream()
                .filter(p -> !p.equals(me) && !p.isForfeited())
                .count();

        CardType bestDiscardType = null;
        int bestScore = Integer.MIN_VALUE;
        for (Map.Entry<CardType, Integer> entry : myCounts.entrySet()) {
            int held = entry.getValue();
            boolean looksDead = held == 1 && activeOpponents >= 2;
            int score = looksDead ? 100 - held : -held;
            if (score > bestScore) {
                bestScore = score;
                bestDiscardType = entry.getKey();
            }
        }

        final CardType toDiscard = bestDiscardType;
        return hand.stream()
                .filter(c -> c.getType() == toDiscard)
                .findFirst()
                .orElseGet(() -> fallback.chooseCardToPass(me, state));
    }
}
