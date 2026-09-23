package com.spt.engine;

import java.util.Optional;

/** Pure win-condition check: 4-of-a-kind in one hand. */
public final class WinDetector {

    private WinDetector() {
    }

    /**
     * Returns the winning player, if any, after a card has just been received.
     * Only the receiving player needs checking since no other hand changed.
     */
    public static Optional<Player> checkWinner(Player justReceived) {
        if (justReceived.hasWinningHand()) {
            return Optional.of(justReceived);
        }
        return Optional.empty();
    }
}
