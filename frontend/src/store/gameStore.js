import { create } from 'zustand';
export const useGameStore = create((set) => ({
    state: null,
    setState: (incomingState) => set((prev) => {
        const currentHand = prev.state?.yourHand ?? [];
        const incomingHand = incomingState.yourHand ?? [];
        const shouldPreserveHand = incomingHand.length === 0 &&
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
