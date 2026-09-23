package com.spt.ai;

import com.spt.engine.Card;
import com.spt.engine.GameState;
import com.spt.engine.Player;

/** Strategy contract for a bot seat: chooses which card to pass on its turn. */
public interface AiStrategy {
    Card chooseCardToPass(Player me, GameState state);
}
