import { useCallback, useEffect, useRef } from 'react';
import { usePreferenceStore } from '@/store/preferenceStore';
import { soundEffects } from '@/utils/soundManager';

export function useSound() {
  const preferences = usePreferenceStore((s) => s.preferences);
  const updatePreferences = usePreferenceStore((s) => s.update);
  const sfxEnabled = preferences.sfxEnabled ?? true;

  const enabledRef = useRef(sfxEnabled);
  enabledRef.current = sfxEnabled;

  useEffect(() => {
    soundEffects.setMuted(!sfxEnabled);
  }, [sfxEnabled]);

  const play = useCallback((name) => {
    if (!enabledRef.current) return;
    soundEffects.play(name);
  }, []);

  const playThap = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playThap();
  }, []);

  const playCardSelect = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playCardSelect();
  }, []);

  const playCardPass = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playCardPass();
  }, []);

  const playTurnAlert = useCallback(() => {
    if (!enabledRef.current || preferences.turnAlertChime === false) return;
    soundEffects.playTurnAlert();
  }, [preferences.turnAlertChime]);

  const playTablaTick = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playTablaTick();
  }, []);

  const playVictory = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playVictory();
  }, []);

  const playChat = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playChatPop();
  }, []);

  const playChai = useCallback(() => {
    if (!enabledRef.current) return;
    soundEffects.playChaiClink();
  }, []);

  const toggleSfx = useCallback(() => {
    updatePreferences({ sfxEnabled: !enabledRef.current });
  }, [updatePreferences]);

  return {
    play,
    playThap,
    playCardSelect,
    playCardPass,
    playTurnAlert,
    playTablaTick,
    playVictory,
    playChat,
    playChai,
    sfxEnabled,
    toggleSfx,
  };
}
