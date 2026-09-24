import { useEffect } from 'react';
import { useNostalgia } from '@/hooks/useNostalgia';
import { soundEffects } from '@/utils/soundManager';

export default function AmbientSoundPlayer() {
  const { ambientSounds, ambientTrack, ambientVolume, muteOnTabBlur } = useNostalgia();

  useEffect(() => {
    if (ambientSounds) {
      soundEffects.startMusic(ambientTrack, ambientVolume / 100);
    } else {
      soundEffects.stopMusic();
    }
  }, [ambientSounds, ambientTrack, ambientVolume]);

  // Tab visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!muteOnTabBlur) return;
      if (document.visibilityState === 'hidden') {
        if (soundEffects.isPlayingMusic()) {
          soundEffects.setMusicVolume(0.001);
        }
      } else {
        if (ambientSounds) {
          soundEffects.setMusicVolume(ambientVolume / 100);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [ambientSounds, ambientVolume, muteOnTabBlur]);

  useEffect(() => {
    return () => {
      soundEffects.stopMusic();
    };
  }, []);

  return null;
}

