import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameSocket } from '@/ws/useGameSocket';
import { useGameStore } from '@/store/gameStore';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { gameApi } from '@/api/gameApi';
import { roomApi } from '@/api/roomApi';
import GameTable from '@/components/game/GameTable';
import ChatPanel from '@/components/game/ChatPanel';
import WinnerBanner from '@/components/game/WinnerBanner';
import MarigoldConfetti from '@/components/nostalgia/MarigoldConfetti';
import ChaiBreakToast from '@/components/nostalgia/ChaiBreakToast';
import Icon from '@/components/common/Icon';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useSound } from '@/hooks/useSound';
import { usePreferenceStore } from '@/store/preferenceStore';
import { MUSIC_TRACKS } from '@/utils/soundManager';

export default function GameTablePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const state = useGameStore((s) => s.state);
  const setState = useGameStore((s) => s.setState);
  const messages = useChatStore((s) => s.messages);
  const userId = useAuthStore((s) => s.userId);
  const { passCard, sendChat } = useGameSocket(gameId ?? null);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const { sfxEnabled, toggleSfx, playChat, playVictory, playThap, playCardPass } = useSound();
  const preferences = usePreferenceStore((s) => s.preferences);
  const updatePrefs = usePreferenceStore((s) => s.update);
  const ambientSounds = Boolean(preferences.ambientSounds);
  const currentMusicTrack = MUSIC_TRACKS.find((t) => t.id === preferences.ambientTrack) || MUSIC_TRACKS[0];

  const toggleMusic = () => {
    updatePrefs({ ambientSounds: !ambientSounds });
  };

  const prevMessagesCount = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesCount.current) {
      playChat();
    }
    prevMessagesCount.current = messages.length;
  }, [messages.length, playChat]);

  useEffect(() => {
    if (!gameId) return;
    gameApi.get(gameId).then(setState).catch(() => {});
  }, [gameId, setState]);

  function handleConfirmPass() {
    if (!selectedCardId) return;
    playCardPass();
    passCard(selectedCardId);
    setSelectedCardId(null);
  }

  async function handleConfirmLeave() {
    try {
      setIsLeaving(true);
      if (state?.roomCode) {
        await roomApi.leave(state.roomCode);
      }
    } catch (err) {
      console.warn('Error while leaving room:', err);
    } finally {
      useRoomStore.getState().clear();
      useChatStore.getState().clear();
      useGameStore.getState().clear();
      setIsLeaving(false);
      setShowLeaveModal(false);
      navigate('/lobby');
    }
  }

  if (!state) return <Loader label="Dealing the parchis…" />;

  const isFinished = state.status === 'FINISHED';
  const winnerOpponent = state.opponents.find((o) => o.id === state.winnerId);
  const winnerUsername =
    state.winnerId === userId ? 'You' : winnerOpponent?.username ?? 'A player';

  return (
    <div className="w-full">
      {/* Room info bar */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant px-space-md lg:px-margin py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-md">
          <span className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant">
            Room Code <strong className="text-on-surface tracking-widest">{state.roomCode}</strong>
          </span>
          <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            <Icon name="style" size={14} /> Turn {state.turnNumber} &bull;{' '}
            {state.yourHand.length + state.opponents.reduce((s, o) => s + o.cardCount, 0)} Parchis in
            Play
          </span>
        </div>

        <div className="flex items-center gap-space-sm">
          {/* Quick Sound FX toggle button in the arena */}
          <button
            type="button"
            onClick={toggleSfx}
            title={
              sfxEnabled
                ? 'Arena Audio: Active (Click to Mute)'
                : 'Arena Audio: Muted (Click to Unmute)'
            }
            aria-label={sfxEnabled ? 'Mute audio effects' : 'Unmute audio effects'}
            className={`flex items-center gap-1.5 px-space-sm py-1 rounded-full border transition-all text-label-sm font-label-sm shadow-sm active:scale-95 cursor-pointer ${
              sfxEnabled
                ? 'border-secondary-container bg-secondary-container/25 text-on-surface font-bold glow-gold'
                : 'border-outline-variant bg-surface-container-high text-on-surface-variant line-through opacity-80'
            }`}
          >
            <Icon
              name={sfxEnabled ? 'volume_up' : 'volume_off'}
              size={16}
              className={sfxEnabled ? 'text-secondary-container' : 'text-on-surface-variant'}
            />
            <span>SFX {sfxEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Soothing Sangeet Music toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            title={
              ambientSounds
                ? `Soothing Music: Playing (${currentMusicTrack.title}) - Click to Pause`
                : 'Soothing Music: Paused - Click to Play'
            }
            aria-label={ambientSounds ? 'Pause soothing music' : 'Play soothing music'}
            className={`flex items-center gap-1.5 px-space-sm py-1 rounded-full border transition-all text-label-sm font-label-sm shadow-sm active:scale-95 cursor-pointer ${
              ambientSounds
                ? 'border-secondary bg-secondary/20 text-on-surface font-bold ring-1 ring-secondary/50'
                : 'border-outline-variant bg-surface-container-high text-on-surface-variant opacity-80'
            }`}
          >
            <Icon
              name={ambientSounds ? 'music_note' : 'music_off'}
              size={16}
              className={ambientSounds ? 'text-secondary' : 'text-on-surface-variant'}
            />
            <span>Sangeet {ambientSounds ? 'ON' : 'OFF'}</span>
          </button>

          <span className="hidden sm:flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
            <Icon name="auto_fix_high" size={16} /> Nostalgia FX
          </span>

          {/* Leave Room Choice Button */}
          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            title="Leave this Baithak room"
            aria-label="Leave room"
            className="flex items-center gap-1.5 px-space-sm py-1 rounded-full border border-red-500/60 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all text-label-sm font-label-sm font-bold shadow-sm active:scale-95 cursor-pointer hover:shadow-md"
          >
            <Icon name="logout" size={16} />
            <span>Leave Room</span>
          </button>
        </div>
      </div>

      <div className="px-space-md lg:px-margin py-space-lg flex flex-col lg:flex-row items-start justify-center gap-space-lg">
        <div className="flex-1 flex justify-center w-full">
          <GameTable
            state={state}
            selectedCardId={selectedCardId}
            onSelectCard={(id) => setSelectedCardId((prev) => (prev === id ? null : id))}
            onConfirmPass={handleConfirmPass}
          />
        </div>
        <ChatPanel messages={messages} onSend={sendChat} />
      </div>

      <MarigoldConfetti active={isFinished && state.winnerId === userId} />
      <ChaiBreakToast />

      {isFinished && (
        <WinnerBanner
          winnerUsername={winnerUsername}
          isYou={state.winnerId === userId}
          onGoToResults={() => navigate(`/results/${gameId}`)}
          onLeave={() => setShowLeaveModal(true)}
        />
      )}

      {/* Confirmation Modal to safely Leave Room */}
      <Modal
        open={showLeaveModal}
        onClose={() => !isLeaving && setShowLeaveModal(false)}
        title="Leave this Baithak?"
      >
        <div className="space-y-space-md">
          <div className="flex items-start gap-space-md">
            <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
              <Icon name="door_open" size={24} />
            </div>
            <div>
              <p className="font-body-md text-body-md text-on-surface">
                Are you sure you want to leave room{' '}
                <strong className="font-mono text-primary font-bold">#{state.roomCode}</strong>?
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                {isFinished
                  ? 'The match is complete. You will safely return to the baithak lobby.'
                  : '⚠️ A game is currently active. If you leave now, your seat will be vacated and you will return to the lobby.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-outline-variant/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLeaveModal(false)}
              disabled={isLeaving}
            >
              Stay &amp; Play
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmLeave}
              disabled={isLeaving}
              className="flex items-center gap-1"
            >
              <Icon name="logout" size={16} />
              <span>{isLeaving ? 'Leaving…' : 'Yes, Leave Room'}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
