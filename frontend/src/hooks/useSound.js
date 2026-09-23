import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { usePreferenceStore } from '@/store/preferenceStore';
import { SOUND_URLS } from '@/utils/soundManager';
const cache = new Map();
function getHowl(name) {
    let howl = cache.get(name);
    if (!howl) {
        howl = new Howl({ src: [SOUND_URLS[name]], volume: 0.5 });
        cache.set(name, howl);
    }
    return howl;
}
export function useSound() {
    const sfxEnabled = usePreferenceStore((s) => s.preferences.sfxEnabled);
    const enabledRef = useRef(sfxEnabled);
    enabledRef.current = sfxEnabled;
    const play = useCallback((name) => {
        if (!enabledRef.current)
            return;
        getHowl(name).play();
    }, []);
    return { play };
}
