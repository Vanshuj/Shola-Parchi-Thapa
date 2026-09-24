import { usePreferenceStore } from '@/store/preferenceStore';
import { useReducedMotion } from './useReducedMotion';
/**
 * Central gate for every nostalgia effect: merges user preferences with
 * prefers-reduced-motion so Tier 2 (motion) and Tier 4 (easter eggs) are
 * force-disabled for anyone who has asked their OS to reduce motion.
 */
export function useNostalgia() {
    const preferences = usePreferenceStore((s) => s.preferences);
    const systemReducedMotion = useReducedMotion();
    const reduceMotion = preferences.reduceMotion || systemReducedMotion;
    return {
        paperTexture: preferences.paperTexture,
        handDrawnBorders: preferences.handDrawnBorders,
        cardAnimations: preferences.cardAnimations && !reduceMotion,
        ambientSounds: preferences.ambientSounds,
        ambientTrack: preferences.ambientTrack || 'yaman',
        ambientVolume: preferences.ambientVolume ?? 50,
        muteOnTabBlur: preferences.muteOnTabBlur ?? true,
        sfxEnabled: preferences.sfxEnabled,
        easterEggs: preferences.easterEggs && !reduceMotion,
        reduceMotion,
    };
}
