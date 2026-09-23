package com.spt.engine;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WinDetectorTest {

    @Test
    void checkWinner_returnsPlayer_whenHandIsFourOfAKind() {
        Player player = new Player(0, 1L, "riya");
        addCards(player, CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_1);
        assertTrue(WinDetector.checkWinner(player).isPresent());
    }

    @Test
    void checkWinner_returnsEmpty_whenHandIsMixed() {
        Player player = new Player(0, 1L, "riya");
        addCards(player, CardType.TYPE_1, CardType.TYPE_2, CardType.TYPE_1, CardType.TYPE_1);
        assertTrue(WinDetector.checkWinner(player).isEmpty());
    }

    @Test
    void checkWinner_returnsEmpty_whenHandNotFull() {
        Player player = new Player(0, 1L, "riya");
        addCards(player, CardType.TYPE_1, CardType.TYPE_1, CardType.TYPE_1);
        assertTrue(WinDetector.checkWinner(player).isEmpty());
    }

    private void addCards(Player player, CardType... types) {
        int i = 0;
        for (CardType t : types) {
            player.addCard(new Card("t" + (i++), t));
        }
    }
}
