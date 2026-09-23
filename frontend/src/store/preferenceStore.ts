import { create } from 'zustand';
import type { Preferences } from '@/types/preference';
import { preferenceApi } from '@/api/preferenceApi';

interface PreferenceState {
  preferences: Preferences;
  fetch: () => Promise<void>;
  update: (partial: Partial<Preferences>) => Promise<void>;
}

export const DEFAULT_PREFERENCES: Preferences = {
  paperTexture: true,
  handDrawnBorders: true,
  cardAnimations: true,
  ambientSounds: false,
  sfxEnabled: false,
  easterEggs: true,
  reduceMotion: false,
};

export const usePreferenceStore = create<PreferenceState>((set, get) => ({
  preferences: DEFAULT_PREFERENCES,
  fetch: async () => {
    try {
      const preferences = await preferenceApi.get();
      set({ preferences });
    } catch {
      set({ preferences: DEFAULT_PREFERENCES });
    }
  },
  update: async (partial) => {
    const next = { ...get().preferences, ...partial };
    set({ preferences: next });
    await preferenceApi.update(partial);
  },
}));
