package com.spt.engine;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

class DeckTest {

    @Test
    void newShuffledDeck_has16UniqueCards_4OfEachType() {
        Deck deck = Deck.newShuffledDeck(new Random(42));
        List<Card> cards = deck.allCards();
        assertEquals(16, cards.size());
        assertEquals(16, cards.stream().map(Card::getId).distinct().count());
        for (CardType type : CardType.values()) {
            long count = cards.stream().filter(c -> c.getType() == type).count();
            assertEquals(4, count);
        }
    }

    @Test
    void deal_toFourPlayers_givesEachExactlyFourCards() {
        Deck deck = Deck.newShuffledDeck(new Random(1));
        List<List<Card>> hands = deck.deal(4);
        assertEquals(4, hands.size());
        hands.forEach(hand -> assertEquals(4, hand.size()));
    }

    @Test
    void deal_toTwoPlayers_dealsOnlyEightCards() {
        Deck deck = Deck.newShuffledDeck(new Random(2));
        List<List<Card>> hands = deck.deal(2);
        int total = hands.stream().mapToInt(List::size).sum();
        assertEquals(8, total);
    }

    @Test
    void deal_rejectsInvalidPlayerCount() {
        Deck deck = Deck.newShuffledDeck(new Random(3));
        assertThrows(IllegalArgumentException.class, () -> deck.deal(1));
        assertThrows(IllegalArgumentException.class, () -> deck.deal(5));
    }
}
