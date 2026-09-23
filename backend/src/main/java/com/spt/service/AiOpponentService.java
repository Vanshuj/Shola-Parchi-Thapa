package com.spt.service;

import com.spt.ai.AiStrategy;
import com.spt.ai.EasyAiStrategy;
import com.spt.ai.HardAiStrategy;
import com.spt.ai.MediumAiStrategy;
import com.spt.engine.Card;
import com.spt.engine.GameState;
import com.spt.engine.Player;
import org.springframework.stereotype.Service;

/** Resolves the configured difficulty to a strategy and asks it for a move. */
@Service
public class AiOpponentService {

    public enum Difficulty { EASY, MEDIUM, HARD }

    public Card chooseMove(Difficulty difficulty, Player me, GameState state) {
        AiStrategy strategy = switch (difficulty) {
            case EASY -> new EasyAiStrategy();
            case MEDIUM -> new MediumAiStrategy();
            case HARD -> new HardAiStrategy();
        };
        return strategy.chooseCardToPass(me, state);
    }
}
