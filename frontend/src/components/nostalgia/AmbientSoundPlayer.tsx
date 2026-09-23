import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useNostalgia } from '@/hooks/useNostalgia';
import { SOUND_URLS } from '@/utils/soundManager';

export default function AmbientSoundPlayer() {
  const { ambientSounds } = useNostalgia();
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (ambientSounds) {
      const howl = new Howl({ src: [SOUND_URLS.ambientRadio], loop: true, volume: 0.15 });
      howl.play();
      howlRef.current = howl;
    }
    return () => {
      howlRef.current?.stop();
      howlRef.current = null;
    };
  }, [ambientSounds]);

  return null;
}
