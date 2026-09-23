package com.spt.engine;

import com.spt.engine.exception.GameOverException;
import com.spt.engine.exception.InvalidCardException;
import com.spt.engine.exception.NotYourTurnException;

/** Pure validation of a proposed pass move against current game state. */
public final class RuleValidator {

    private RuleValidator() {
    }

    public static void validatePass(GameState state, Long actingUserId, String cardId) {
        if (state.getStatus() != GameState.Status.ACTIVE) {
            throw new GameOverException("Game " + state.getGameId() + " is not active");
        }
        Player current = state.getCurrentPlayer();
        boolean isCurrentUser = current.isGhost()
                ? actingUserId == null
                : current.getUserId().map(id -> id.equals(actingUserId)).orElse(false);
        if (!isCurrentUser) {
            throw new NotYourTurnException("It is not user " + actingUserId + "'s turn");
        }
        if (!current.hasCard(cardId)) {
            throw new InvalidCardException("Card " + cardId + " is not in the current player's hand");
        }
    }
}
