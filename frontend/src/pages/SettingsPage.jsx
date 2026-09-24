import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/common/Icon';
import Button from '@/components/common/Button';
import { usePreferenceStore } from '@/store/preferenceStore';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { soundEffects, MUSIC_TRACKS } from '@/utils/soundManager';

const AVATAR_OPTIONS = [
  { id: 'raja', label: 'Raja', icon: 'crown', role: 'Royal Collector', desc: 'Regal composure & strategic patience' },
  { id: 'dadi', label: 'Dadi', icon: 'elderly_woman', role: 'Wise Matriarch', desc: 'Sharp eyes & uncanny card tracking' },
  { id: 'chacha', label: 'Chacha ji', icon: 'face', role: 'Baithak Elder', desc: 'Bluffs with sips of cutting chai' },
  { id: 'chhotu', label: 'Chhotu', icon: 'bolt', role: 'Speedster', desc: 'Fastest hand in the verandah' },
  { id: 'chai', label: 'Chai Master', icon: 'emoji_food_beverage', role: 'Tea Enthusiast', desc: 'Keeps everyone energized' },
];

const BOT_DIFFICULTIES = [
  { id: 'seedha', label: 'Seedha', speed: 'Casual', desc: 'Relaxed rhythm, generous pass windows & easygoing slaps' },
  { id: 'chalak', label: 'Chalak', speed: 'Standard', desc: 'Smart card retention & observant clockwise passing' },
  { id: 'ustaad', label: 'Ustaad', speed: 'Pro', desc: 'Frantic passes & lightning-fast THAP slams upon quartet' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { preferences, update, resetDefaults, fetch } = usePreferenceStore();
  const { theme, setTheme, toggleTheme } = useThemeStore();
  const { username, logout } = useAuthStore();

  const [toastMessage, setToastMessage] = useState(null);
  const [shoutInput, setShoutInput] = useState(preferences.customThapShout || 'THAP!');

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (preferences.customThapShout) {
      setShoutInput(preferences.customThapShout);
    }
  }, [preferences.customThapShout]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleMasterVolume(val) {
    update({ masterVolume: val });
  }

  function handleSfxVolume(val) {
    update({ sfxVolume: val });
  }

  function handleTestThap() {
    soundEffects.playThap();
    showToast('💥 Tested "THAP!" floor slap sound');
  }

  function handleTestChime() {
    soundEffects.playTurnAlert();
    showToast('🔔 Tested turn alert chime');
  }

  function handleShoutSubmit(e) {
    if (e) e.preventDefault();
    const clean = shoutInput.trim().toUpperCase() || 'THAP!';
    update({ customThapShout: clean });
    showToast(`Victory shout saved: "${clean}"`);
  }

  function handleClearCache() {
    try {
      localStorage.removeItem('spt-audio-cache');
      soundEffects.init();
      showToast('🧹 Local game & audio cache cleared successfully!');
    } catch {
      showToast('Cache cleared.');
    }
  }

  async function handleResetAll() {
    await resetDefaults();
    setShoutInput('THAP!');
    showToast('↺ Restored all settings to authentic Verandah defaults!');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="max-w-5xl mx-auto px-space-md lg:px-margin py-space-xl">
      {/* Toast Feedback Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-surface-container-highest border border-secondary text-on-surface px-space-lg py-space-md shadow-2xl flex items-center gap-space-xs font-label-md text-label-md font-bold animate-bounce">
          <Icon name="check_circle" size={20} className="text-secondary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-space-xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-space-xs">
          <Icon name="tune" size={16} />
          <span>Sutra #08 &bull; Verandah Studio Controls</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
          Baithak Atmosphere &amp; Settings
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-1">
          Calibrate the tactile memory of sultry afternoons, chai-stained ledgers, hand-carved block prints, and acoustic verandah dynamics. Personalize how every parchi feels under your fingertips.
        </p>
      </div>

      <div className="space-y-space-xl">
        {/* ========================================================= */}
        {/* SECTION 1: Audio & Foley Suite */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon name="volume_up" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">1. Audio &amp; Foley Suite</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Analog room acoustic foley, table slams, and vintage transistor murmurs</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              Web Audio 48kHz
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Master Volume */}
            <div className="space-y-2 p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40">
              <div className="flex items-center justify-between">
                <label htmlFor="master-volume-slider" className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5 cursor-pointer">
                  <Icon name="volume_up" size={18} className="text-secondary" />
                  <span>Master Volume</span>
                </label>
                <span className="font-mono font-bold text-label-md text-primary">{preferences.masterVolume ?? 80}%</span>
              </div>
              <input
                id="master-volume-slider"
                type="range"
                min="0"
                max="100"
                value={preferences.masterVolume ?? 80}
                onChange={(e) => handleMasterVolume(Number(e.target.value))}
                aria-label="Master Volume"
                className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer"
              />
              <p className="font-body-sm text-body-sm text-on-surface-variant">Controls global loudness across all instruments, chimes, and cards.</p>
            </div>

            {/* SFX Volume & Master SFX Toggle */}
            <div className="space-y-2 p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="graphic_eq" size={18} className="text-secondary" />
                  <span>Sound Effects (SFX &amp; Foley)</span>
                </label>
                <input
                  type="checkbox"
                  checked={preferences.sfxEnabled ?? true}
                  onChange={(e) => update({ sfxEnabled: e.target.checked })}
                  className="h-5 w-5 accent-primary rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant">SFX Level</span>
                <span className="font-mono font-bold text-label-sm text-secondary">{preferences.sfxVolume ?? 80}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.sfxVolume ?? 80}
                onChange={(e) => handleSfxVolume(Number(e.target.value))}
                disabled={!(preferences.sfxEnabled ?? true)}
                className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg cursor-pointer disabled:opacity-40"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTestThap}
                  disabled={!(preferences.sfxEnabled ?? true)}
                  className="px-space-sm py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold hover:brightness-105 transition-all flex items-center gap-1 disabled:opacity-40"
                >
                  <Icon name="pan_tool" size={14} />
                  <span>Test THAP! Slam</span>
                </button>
                <button
                  type="button"
                  onClick={handleTestChime}
                  disabled={!(preferences.sfxEnabled ?? true)}
                  className="px-space-sm py-1 rounded bg-surface-container-highest hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-bold transition-all flex items-center gap-1 disabled:opacity-40"
                >
                  <Icon name="notifications" size={14} />
                  <span>Test Turn Chime</span>
                </button>
              </div>
            </div>

            {/* Turn Alert Chime Toggle */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="notifications_active" size={18} className="text-primary" />
                  <span>Turn Alert Chime</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Resonant temple bell cue when turn passes to you + tabla countdown tick during the final 5 seconds.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.turnAlertChime ?? true}
                onChange={(e) => update({ turnAlertChime: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>

            {/* Mute on Tab Blur */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="tab" size={18} className="text-secondary" />
                  <span>Mute Audio on Tab Blur</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Automatically silences background music and sounds whenever you switch tabs or minimize the browser.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.muteOnTabBlur ?? true}
                onChange={(e) => update({ muteOnTabBlur: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>
          </div>

          {/* Ambient Soothing Sangeet Suite */}
          <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-2">
                <Icon name="queue_music" size={20} className="text-secondary" />
                <span>Baithak Sangeet &amp; Soothing Ambient Music</span>
              </span>
              <div className="flex items-center gap-space-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  {preferences.ambientSounds ? 'Music Playing' : 'Music Paused'}
                </span>
                <input
                  type="checkbox"
                  checked={preferences.ambientSounds ?? false}
                  onChange={(e) => {
                    const willPlay = e.target.checked;
                    update({ ambientSounds: willPlay });
                    showToast(willPlay ? '🎵 Playing soothing baithak music' : '🔇 Soothing music paused');
                  }}
                  className="h-5 w-5 accent-secondary rounded cursor-pointer"
                />
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Peaceful procedural Indian classical melodies, ambient courtyard rainfall, and soothing nature sounds designed to relax the mind while playing.
            </p>

            {/* Ambient Music Volume Slider */}
            <div className="mb-space-md p-space-sm rounded-lg bg-surface-container/60 border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <span className="font-label-sm text-label-sm font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="volume_down" size={18} className="text-secondary" />
                <span>Sangeet Volume: {preferences.ambientVolume ?? 50}%</span>
              </span>
              <div className="flex items-center gap-space-sm w-full sm:w-64">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={preferences.ambientVolume ?? 50}
                  onChange={(e) => update({ ambientVolume: Number(e.target.value) })}
                  className="w-full accent-secondary cursor-pointer h-2 bg-surface-container-highest rounded-lg"
                />
              </div>
            </div>

            {/* 4 Soothing Tracks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              {MUSIC_TRACKS.map((trk) => {
                const isSelected = (preferences.ambientTrack ?? 'yaman') === trk.id;
                const isPlayingThis = isSelected && Boolean(preferences.ambientSounds);

                return (
                  <div
                    key={trk.id}
                    className={`p-space-md rounded-xl border text-left transition-all flex flex-col justify-between gap-space-xs ${
                      isSelected
                        ? 'border-secondary/80 bg-secondary/10 shadow-sm ring-1 ring-secondary/40'
                        : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-space-xs">
                      <div className="flex items-start gap-space-sm">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-secondary'}`}>
                          <Icon name={trk.icon} size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md font-bold text-on-surface">{trk.title}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-container-highest text-secondary uppercase tracking-wider">
                              {trk.category}
                            </span>
                          </div>
                          <span className="font-body-sm text-[12px] text-secondary font-medium block">
                            {trk.subtitle}
                          </span>
                        </div>
                      </div>

                      {isPlayingThis && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-secondary px-2 py-0.5 rounded-full bg-secondary-container/40 animate-pulse shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          Playing
                        </span>
                      )}
                    </div>

                    <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed mt-1">
                      {trk.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected && preferences.ambientSounds) {
                            update({ ambientSounds: false });
                            showToast(`🔇 Paused ${trk.title}`);
                          } else {
                            update({ ambientTrack: trk.id, ambientSounds: true });
                            showToast(`🎵 Playing ${trk.title}`);
                          }
                        }}
                        className={`px-space-sm py-1 rounded-lg text-label-sm font-label-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPlayingThis
                            ? 'bg-secondary text-on-secondary shadow-sm'
                            : 'bg-surface-container-highest hover:bg-surface-container-high text-on-surface'
                        }`}
                      >
                        <Icon name={isPlayingThis ? 'pause' : 'play_arrow'} size={16} />
                        <span>{isPlayingThis ? 'Pause Track' : 'Play This Music'}</span>
                      </button>

                      {isSelected && (
                        <span className="font-label-sm text-[11px] text-secondary font-bold">
                          ✓ Active Preset
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: Gameplay & Table Ergonomics */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/40 text-secondary flex items-center justify-center">
                <Icon name="sports_esports" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">2. Gameplay &amp; Table Ergonomics</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Card selection speed, rapid hand passing, hotkeys, and AFK rules</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Reflex Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Card Passing Mode */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="touch_app" size={18} className="text-primary" />
                <span>Card Passing Mode</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Choose how you send cards to your clockwise neighbor.</p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                {[
                  { id: 'tap', label: 'Tap-to-Select & Pass', badge: 'Fast Touch' },
                  { id: 'drag', label: 'Drag & Drop Gesture', badge: 'Tactile' },
                ].map((mode) => {
                  const isSel = (preferences.cardPassingMode ?? 'tap') === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => update({ cardPassingMode: mode.id })}
                      className={`p-space-sm rounded-lg border text-left transition-all ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="font-label-sm text-label-sm font-bold block text-on-surface">{mode.label}</span>
                      <span className="text-[10px] text-primary uppercase font-bold">{mode.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Keyboard Shortcuts */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="keyboard" size={18} className="text-secondary" />
                  <span>Desktop Keyboard Shortcuts</span>
                </span>
                <input
                  type="checkbox"
                  checked={preferences.keyboardShortcuts ?? true}
                  onChange={(e) => update({ keyboardShortcuts: e.target.checked })}
                  className="h-5 w-5 accent-primary rounded cursor-pointer"
                />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Enable instant hotkeys for tournament-level speed:</p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-label-sm">
                <span className="px-2 py-1 rounded bg-surface-container-highest border border-outline-variant text-primary font-bold">Space / Enter</span>
                <span className="text-body-sm text-on-surface-variant">= THAP! Slap</span>
                <span className="px-2 py-1 rounded bg-surface-container-highest border border-outline-variant text-secondary font-bold">1, 2, 3, 4</span>
                <span className="text-body-sm text-on-surface-variant">= Pick Parchi</span>
              </div>
            </div>

            {/* Auto-Pass Timeout Rule */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="timer" size={18} className="text-secondary" />
                <span>Auto-Pass on Timeout (AFK Protection)</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">What should the server pass if your 15s turn timer expires?</p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                {[
                  { id: 'rightmost', label: 'Rightmost Card', hint: 'Predictable slot 4' },
                  { id: 'random', label: 'Random Non-Match', hint: 'Protects matching sets' },
                ].map((opt) => {
                  const isSel = (preferences.autoPassMode ?? 'rightmost') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update({ autoPassMode: opt.id })}
                      className={`p-space-sm rounded-lg border text-left transition-all ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="font-label-sm text-label-sm font-bold block text-on-surface">{opt.label}</span>
                      <span className="text-[11px] text-on-surface-variant">{opt.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card Auto-Grouping */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="sort" size={18} className="text-primary" />
                  <span>Card Auto-Grouping</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Automatically sorts matching identities side-by-side in your hand as new chits are passed to you.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoGroupCards ?? true}
                onChange={(e) => update({ autoGroupCards: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: Atmosphere, Visuals & Performance */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-center">
                <Icon name="palette" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">3. Atmosphere, Visuals &amp; Performance</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Day/Night illumination, 3D WebGL vs 2D Lite mode, and paper patina</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-tertiary-container font-label-sm text-label-sm text-on-tertiary font-bold">
              Visual Patina
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Theme Illumination */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="light_mode" size={18} className="text-secondary" />
                <span>Courtyard Illumination</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Switch between daylight sunlit veranda and night lantern glow.</p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-space-sm rounded-lg border text-left transition-all flex items-center gap-2 ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <Icon name="wb_sunny" size={22} className="text-amber-500" />
                  <div>
                    <span className="font-label-sm text-label-sm font-bold block text-on-surface">Dopahar</span>
                    <span className="text-[10px] text-secondary font-bold">Sunlit Courtyard</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-space-sm rounded-lg border text-left transition-all flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                  }`}
                >
                  <Icon name="dark_mode" size={22} className="text-indigo-400" />
                  <div>
                    <span className="font-label-sm text-label-sm font-bold block text-on-surface">Raat</span>
                    <span className="text-[10px] text-indigo-400 font-bold">Lantern Lights</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Graphics Mode (3D vs 2D Lite) */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="view_in_ar" size={18} className="text-primary" />
                <span>Graphics Render Fidelity</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Choose between rich 3D simulation and ultra-fast 2D lite mode.</p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                {[
                  { id: '3D', label: '3D Baithak Mode', hint: 'Full 3D WebGL physics' },
                  { id: '2D', label: '2D Lite Mode', hint: '60fps battery saver' },
                ].map((mode) => {
                  const isSel = (preferences.graphicsMode ?? '3D') === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => update({ graphicsMode: mode.id })}
                      className={`p-space-sm rounded-lg border text-left transition-all ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="font-label-sm text-label-sm font-bold block text-on-surface">{mode.label}</span>
                      <span className="text-[11px] text-on-surface-variant">{mode.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paper Texture Grain */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="description" size={18} className="text-secondary" />
                  <span>Handmade Khadi Paper Texture</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Applies fibrous organic grain and spinal folding crease across all cards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.paperTexture ?? true}
                onChange={(e) => update({ paperTexture: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>

            {/* Hand-Drawn Borders & Rangoli */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="brush" size={18} className="text-primary" />
                  <span>Wobbly Borders &amp; Rangoli</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Replaces clinical straight lines with imperfect block-printed stamp outlines and floral motifs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.handDrawnBorders ?? true}
                onChange={(e) => update({ handDrawnBorders: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>

            {/* Reduce Motion */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="accessibility_new" size={18} className="text-secondary" />
                  <span>Reduce Motion Priority</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Disables heavy card flip tosses and table slam vibration effects for comfort.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.reduceMotion ?? false}
                onChange={(e) => update({ reduceMotion: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>

            {/* 3D Parchi Card Flip Animation */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="flip" size={18} className="text-primary" />
                  <span>3D Parchi Flip &amp; Slide</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Smooth card toss motion across the center table ring with perspective depth.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.cardAnimations ?? true}
                onChange={(e) => update({ cardAnimations: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: Baithak Persona & Social Identity */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <Icon name="badge" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">4. Baithak Persona &amp; Identity</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Your player character, custom victory shout, and in-game reaction emotes</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-secondary-container font-label-sm text-label-sm text-on-secondary-container font-bold">
              Khiladi Persona
            </span>
          </div>

          <div className="space-y-space-md">
            {/* Table Avatar Selector */}
            <div>
              <span className="font-label-md text-label-md font-bold text-on-surface block mb-space-xs">
                Select Your Table Character:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm">
                {AVATAR_OPTIONS.map((av) => {
                  const isSel = (preferences.playerAvatar ?? 'raja') === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => update({ playerAvatar: av.id })}
                      className={`p-space-sm rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-md scale-105'
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                        isSel ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-secondary'
                      }`}>
                        <Icon name={av.icon} size={24} />
                      </div>
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">{av.label}</span>
                      <span className="font-body-sm text-[10px] text-secondary font-bold leading-tight">{av.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom "THAP!" Victory Shout */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40">
              <span className="font-label-md text-label-md font-bold text-on-surface block mb-1">
                Custom &ldquo;THAP!&rdquo; Victory Shout:
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                This custom slogan will appear prominently on everyone&rsquo;s screen when you slap the floor and win the round!
              </p>
              <form onSubmit={handleShoutSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm">
                <input
                  type="text"
                  maxLength={32}
                  value={shoutInput}
                  onChange={(e) => setShoutInput(e.target.value)}
                  placeholder="THAP!"
                  className="flex-1 bg-surface-container-low px-space-md py-2 rounded-lg font-label-md text-label-md text-on-surface uppercase font-bold outline-none border border-outline-variant focus:border-primary"
                />
                <Button type="submit" size="sm" className="shrink-0 justify-center">
                  Save Shout
                </Button>
              </form>
              <div className="mt-space-sm flex flex-wrap items-center gap-1.5">
                <span className="text-body-sm text-on-surface-variant text-[11px]">Popular shouts:</span>
                {['THAP!', 'SABKE KAAN KHADE!', 'BAITHAK JEET LI!', 'CHIT CHOR PAKDA GAYA!'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setShoutInput(preset);
                      update({ customThapShout: preset });
                      showToast(`Shout updated to "${preset}"`);
                    }}
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-secondary text-[10px] font-bold uppercase transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Emote Wheel Toggle */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="mood" size={18} className="text-secondary" />
                  <span>Quick Reaction Emote Wheel</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Enables in-game reaction bubbles during match play (☕ Chai, ✋ Thap, 😂 Laugh, 🤔 Thinking, 🤫 Shh).
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emoteWheel ?? true}
                onChange={(e) => update({ emoteWheel: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: Room & AI Bot Defaults */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon name="smart_toy" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">5. Room &amp; AI Bot Defaults</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Default room privacy, auto-fill bot speed, and chat notification sounds</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              Matchmaking
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* Default Room Privacy */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="lock" size={18} className="text-secondary" />
                <span>Default Created Room Privacy</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Privacy applied when you create a new Baithak table.</p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                {[
                  { id: 'private', label: 'Private (Code Only)', icon: 'lock' },
                  { id: 'public', label: 'Public (Open Match)', icon: 'public' },
                ].map((opt) => {
                  const isSel = (preferences.defaultRoomPrivacy ?? 'private') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => update({ defaultRoomPrivacy: opt.id })}
                      className={`p-space-sm rounded-lg border text-left transition-all flex items-center gap-2 ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <Icon name={opt.icon} size={18} className={isSel ? 'text-primary' : 'text-secondary'} />
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default AI Bot Fill */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="group_add" size={18} className="text-primary" />
                  <span>Auto-Fill With AI Bots</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Automatically populates open seats with computer players so rooms start without waiting.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.autoFillBots ?? true}
                onChange={(e) => update({ autoFillBots: e.target.checked })}
                className="h-5 w-5 accent-primary rounded cursor-pointer shrink-0 mt-1"
              />
            </div>

            {/* Bot Personality / Speed */}
            <div className="md:col-span-2 p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 space-y-space-xs">
              <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <Icon name="psychology" size={18} className="text-secondary" />
                <span>AI Bot Behavior &amp; Slap Speed</span>
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Calibrate how aggressively computer ghost players pass cards and call THAP.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-1">
                {BOT_DIFFICULTIES.map((diff) => {
                  const isSel = (preferences.botDifficulty ?? 'chalak') === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => update({ botDifficulty: diff.id })}
                      className={`p-space-md rounded-xl border text-left transition-all ${
                        isSel
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-label-md text-label-md font-bold text-on-surface">{diff.label}</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-[10px] text-secondary font-bold uppercase">{diff.speed}</span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">{diff.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: Account, Data & Reset Controls */}
        {/* ========================================================= */}
        <section className="rounded-2xl bg-surface-container-low border border-outline-variant/60 p-space-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-space-md mb-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center">
                <Icon name="manage_accounts" size={24} />
              </div>
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">6. Account, Data &amp; Reset Controls</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Custom deck synchronization, cache cleaning, session logout, and factory defaults</p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-space-sm py-0.5 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-on-surface-variant font-bold">
              Maintenance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Custom Deck Sync Link */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="stylus_note" size={18} className="text-primary" />
                  <span>Custom Handwritten Parchi Decks</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Rename your 4 quartet suits with family nicknames, Bollywood villains, or street food delights.
                </p>
              </div>
              <Link
                to="/customize"
                className="mt-space-md inline-flex items-center gap-1.5 text-primary font-label-md font-bold hover:underline"
              >
                <span>Open Parchi Customizer</span>
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>

            {/* Clear Cache */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="cleaning_services" size={18} className="text-secondary" />
                  <span>Clear Audio &amp; Match Cache</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Clears local sound synthesizer buffers and transient room drafts without deleting your account.
                </p>
              </div>
              <div className="mt-space-md">
                <Button variant="ghost" size="sm" onClick={handleClearCache} className="w-full sm:w-auto justify-center">
                  Clear Local Cache
                </Button>
              </div>
            </div>

            {/* Reset All to Defaults */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="restart_alt" size={18} className="text-secondary" />
                  <span>Restore Factory Verandah Defaults</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Quickly reverts all 6 setting categories back to original calibrated values.
                </p>
              </div>
              <div className="mt-space-md">
                <Button variant="secondary" size="sm" onClick={handleResetAll} className="w-full sm:w-auto justify-center">
                  Reset All to Defaults
                </Button>
              </div>
            </div>

            {/* Account & Logout */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col justify-between">
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="account_circle" size={18} className="text-primary" />
                  <span>Account Session</span>
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Signed in as <strong>{username || 'Khiladi'}</strong>.
                </p>
              </div>
              <div className="mt-space-md flex items-center gap-space-sm">
                <Button variant="danger" size="sm" onClick={handleLogout} className="w-full sm:w-auto justify-center">
                  Sign Out of Baithak
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
