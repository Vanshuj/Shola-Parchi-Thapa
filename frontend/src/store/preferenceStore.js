import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { preferenceApi } from '@/api/preferenceApi';
import { soundEffects } from '@/utils/soundManager';

const BACKEND_KEYS = [
  'paperTexture',
  'handDrawnBorders',
  'cardAnimations',
  'ambientSounds',
  'sfxEnabled',
  'easterEggs',
  'reduceMotion',
];

export const DEFAULT_PREFERENCES = {
  // 1. Audio & Foley Suite
  masterVolume: 80,
  sfxEnabled: true,
  sfxVolume: 80,
  turnAlertChime: true,
  ambientSounds: false,
  ambientTrack: 'yaman', // 'yaman' | 'monsoon' | 'radio' | 'morning'
  ambientVolume: 50,
  muteOnTabBlur: true,

  // 2. Gameplay & Controls
  cardPassingMode: 'tap', // 'tap' | 'drag'
  keyboardShortcuts: true,
  autoPassMode: 'rightmost', // 'rightmost' | 'random'
  autoGroupCards: true,

  // 3. Atmosphere & Performance
  graphicsMode: '3D', // '3D' | '2D'
  paperTexture: true,
  handDrawnBorders: true,
  cardAnimations: true,
  reduceMotion: false,
  easterEggs: true,

  // 4. Baithak Persona
  playerAvatar: 'raja', // 'raja' | 'dadi' | 'chacha' | 'chhotu' | 'chai'
  customThapShout: 'THAP!',
  emoteWheel: true,

  // 5. Room & Bots Defaults
  defaultRoomPrivacy: 'private', // 'private' | 'public'
  autoFillBots: true,
  botDifficulty: 'chalak', // 'seedha' | 'chalak' | 'ustaad'
  chatSoundAlerts: true,
};

export const usePreferenceStore = create()(
  persist(
    (set, get) => ({
      preferences: DEFAULT_PREFERENCES,
      fetch: async () => {
        try {
          const serverPrefs = await preferenceApi.get();
          set((state) => ({
            preferences: { ...state.preferences, ...serverPrefs },
          }));
        } catch {
          // Keep current persisted local preferences
        }
      },
      update: async (partial) => {
        const next = { ...get().preferences, ...partial };
        set({ preferences: next });

        // Live audio sync
        if ('masterVolume' in partial) {
          soundEffects.setVolume(partial.masterVolume / 100);
        }
        if ('sfxEnabled' in partial) {
          soundEffects.setMuted(!partial.sfxEnabled);
        }
        if ('sfxVolume' in partial) {
          soundEffects.setSfxVolume(partial.sfxVolume / 100);
        }
        if ('ambientVolume' in partial) {
          soundEffects.setMusicVolume(partial.ambientVolume / 100);
        }
        if ('ambientSounds' in partial || 'ambientTrack' in partial) {
          const track = partial.ambientTrack || next.ambientTrack || 'yaman';
          const vol = (next.ambientVolume ?? 50) / 100;
          if (next.ambientSounds) {
            soundEffects.startMusic(track, vol);
          } else {
            soundEffects.stopMusic();
          }
        }

        // Sync supported fields to backend if authenticated
        const backendPayload = {};
        for (const k of Object.keys(partial)) {
          if (BACKEND_KEYS.includes(k)) {
            backendPayload[k] = partial[k];
          }
        }
        if (Object.keys(backendPayload).length > 0) {
          try {
            await preferenceApi.update(backendPayload);
          } catch {
            // Ignore backend error for guest/offline
          }
        }
      },
      resetDefaults: async () => {
        set({ preferences: { ...DEFAULT_PREFERENCES } });
        soundEffects.setVolume(DEFAULT_PREFERENCES.masterVolume / 100);
        soundEffects.setMuted(!DEFAULT_PREFERENCES.sfxEnabled);
        soundEffects.stopMusic();
        try {
          await preferenceApi.update({
            paperTexture: true,
            handDrawnBorders: true,
            cardAnimations: true,
            ambientSounds: false,
            sfxEnabled: true,
            easterEggs: true,
            reduceMotion: false,
          });
        } catch {}
      },
    }),
    { name: 'spt-preferences' }
  )
);
