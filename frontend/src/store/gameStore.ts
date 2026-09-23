import { create } from 'zustand';
import type { GameStateDTO } from '@/types/game';

interface GameState {
  state: GameStateDTO | null;
  setState: (state: GameStateDTO) => void;
  clear: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  state: null,
  setState: (incomingState) =>
    set((prev) => {
      const currentHand = prev.state?.yourHand ?? [];
      const incomingHand = incomingState.yourHand ?? [];
      const shouldPreserveHand =
        incomingHand.length === 0 &&
        currentHand.length > 0 &&
        prev.state?.gameId === incomingState.gameId &&
        incomingState.status !== 'FINISHED';

      return {
        state: {
          ...incomingState,
          yourHand: shouldPreserveHand ? currentHand : incomingHand,
        },
      };
    }),
  clear: () => set({ state: null }),
}));
