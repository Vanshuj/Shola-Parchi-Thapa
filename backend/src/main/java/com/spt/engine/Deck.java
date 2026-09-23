package com.spt.engine;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Builds and shuffles the 16-card deck: 4 cards of each of the 4 types.
 * Card ids are stable within a single deck instance ("c1".."c16") so they
 * can be referenced deterministically for the lifetime of a game.
 */
public final class Deck {

    private final List<Card> cards;

    private Deck(List<Card> cards) {
        this.cards = cards;
    }

    public static Deck newShuffledDeck() {
        return newShuffledDeck(new SecureRandom());
    }

    public static Deck newShuffledDeck(java.util.Random random) {
        List<Card> built = new ArrayList<>(16);
        int counter = 1;
        for (CardType type : CardType.values()) {
            for (int i = 0; i < 4; i++) {
                built.add(new Card("c" + counter, type));
                counter++;
            }
        }
        Collections.shuffle(built, random);
        return new Deck(built);
    }

    /** Deals the deck out to the given number of players (2-4), 4 cards each, round-robin. */
    public List<List<Card>> deal(int playerCount) {
        if (playerCount < 2 || playerCount > 4) {
            throw new IllegalArgumentException("playerCount must be between 2 and 4");
        }
        List<List<Card>> hands = new ArrayList<>();
        for (int p = 0; p < playerCount; p++) {
            hands.add(new ArrayList<>());
        }
        // Only the first playerCount*4 cards are used when fewer than 4 players play;
        // the remainder stay out of play (kept for auditability, never dealt).
        int cardsToDeal = playerCount * 4;
        for (int i = 0; i < cardsToDeal; i++) {
            hands.get(i % playerCount).add(cards.get(i));
        }
        return hands;
    }

    public List<Card> allCards() {
        return Collections.unmodifiableList(cards);
    }
}
