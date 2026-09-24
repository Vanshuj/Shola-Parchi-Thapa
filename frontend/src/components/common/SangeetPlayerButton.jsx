import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { usePreferenceStore } from '@/store/preferenceStore';
import { MUSIC_TRACKS } from '@/utils/soundManager';

export default function SangeetPlayerButton() {
  const { preferences, update } = usePreferenceStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const isPlaying = Boolean(preferences.ambientSounds);
  const currentTrackId = preferences.ambientTrack || 'yaman';
  const currentTrack = MUSIC_TRACKS.find((t) => t.id === currentTrackId) || MUSIC_TRACKS[0];
  const volume = preferences.ambientVolume ?? 50;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const togglePlay = () => {
    update({ ambientSounds: !isPlaying });
  };

  const selectTrack = (trackId) => {
    update({ ambientTrack: trackId, ambientSounds: true });
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Navbar Sangeet Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={togglePlay}
          title={isPlaying ? `Playing: ${currentTrack.title} (Click to Pause)` : 'Play Soothing Baithak Music'}
          aria-label={isPlaying ? 'Pause music' : 'Play soothing music'}
          className={`flex items-center gap-1.5 px-space-sm py-1.5 rounded-l-lg border transition-all text-label-sm font-label-sm shadow-sm active:scale-95 cursor-pointer ${
            isPlaying
              ? 'border-secondary/80 bg-secondary/15 text-on-surface font-bold ring-1 ring-secondary/40'
              : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true">
              <span className="w-1 bg-secondary rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-secondary rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.2s] h-2" />
              <span className="w-1 bg-secondary rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.4s] h-3.5" />
            </div>
          ) : (
            <Icon name="music_note" size={17} className="text-secondary" />
          )}
          <span className="hidden sm:inline font-bold">
            {isPlaying ? currentTrack.title.split(' ')[0] : 'Sangeet'}
          </span>
        </button>

        {/* Dropdown open trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Choose Soothing Track & Volume"
          aria-label="Open soothing music menu"
          className={`px-1.5 py-1.5 rounded-r-lg border border-l-0 transition-all text-label-sm shadow-sm cursor-pointer ${
            isPlaying
              ? 'border-secondary/80 bg-secondary/20 text-secondary'
              : 'border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
          }`}
        >
          <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={16} />
        </button>
      </div>

      {/* Flyout Glassmorphic Music Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-surface-container-lowest/95 dark:bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/60 shadow-2xl p-space-md z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/40 mb-space-sm">
            <div className="flex items-center gap-1.5">
              <Icon name="queue_music" size={18} className="text-secondary" />
              <span className="font-label-md text-label-md font-bold text-on-surface">Baithak Sangeet</span>
            </div>
            <button
              type="button"
              onClick={togglePlay}
              className={`px-space-xs py-0.5 rounded-full text-label-sm font-bold text-[11px] flex items-center gap-1 transition-all ${
                isPlaying
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon name={isPlaying ? 'pause' : 'play_arrow'} size={14} />
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="mb-space-sm p-space-xs rounded-lg bg-surface-container/50 border border-outline-variant/30 flex items-center gap-space-sm">
            <Icon name="volume_down" size={16} className="text-secondary shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => update({ ambientVolume: Number(e.target.value) })}
              className="w-full accent-secondary cursor-pointer h-1.5 bg-surface-container-highest rounded-lg"
            />
            <span className="font-label-sm text-[11px] font-mono text-on-surface-variant w-8 text-right shrink-0">
              {volume}%
            </span>
          </div>

          {/* Track List */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
            {MUSIC_TRACKS.map((trk) => {
              const isSelected = currentTrackId === trk.id;
              const isPlayingThis = isSelected && isPlaying;

              return (
                <button
                  key={trk.id}
                  type="button"
                  onClick={() => selectTrack(trk.id)}
                  className={`w-full p-2 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-secondary/70 bg-secondary/15 text-on-surface shadow-xs'
                      : 'border-outline-variant/30 bg-surface-container/60 hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    <Icon name={trk.icon} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[12px] font-bold text-on-surface truncate">
                        {trk.title}
                      </span>
                      {isPlayingThis && (
                        <span className="text-[10px] text-secondary font-bold shrink-0 animate-pulse">
                          ● Playing
                        </span>
                      )}
                    </div>
                    <span className="font-body-sm text-[10px] text-secondary block truncate">
                      {trk.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
