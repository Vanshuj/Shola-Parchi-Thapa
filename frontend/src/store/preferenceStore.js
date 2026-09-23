import { create } from 'zustand';
import { preferenceApi } from '@/api/preferenceApi';
export const DEFAULT_PREFERENCES = {
    paperTexture: true,
    handDrawnBorders: true,
    cardAnimations: true,
    ambientSounds: false,
    sfxEnabled: false,
    easterEggs: true,
    reduceMotion: false,
};
export const usePreferenceStore = create((set, get) => ({
    preferences: DEFAULT_PREFERENCES,
    fetch: async () => {
        try {
            const preferences = await preferenceApi.get();
            set({ preferences });
        }
        catch {
            set({ preferences: DEFAULT_PREFERENCES });
        }
    },
    update: async (partial) => {
        const next = { ...get().preferences, ...partial };
        set({ preferences: next });
        await preferenceApi.update(partial);
    },
}));
