import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePreferenceStore } from '@/store/preferenceStore';
import PlayerHand from './PlayerHand';
import OpponentChip from './OpponentChip';
import TurnTimer from './TurnTimer';
import Icon from '@/components/common/Icon';
import { useTurnTimer } from '@/hooks/useTurnTimer';
import { useSound } from '@/hooks/useSound';

export default function GameTable({ state, selectedCardId, onSelectCard, onConfirmPass }) {
  const userId = useAuthStore((s) => s.userId);
  const isYourTurn =
    state.currentTurnPlayerId != null &&
    userId != null &&
    Number(state.currentTurnPlayerId) === Number(userId);
  const secondsLeft = useTurnTimer(state.turnDeadline);

  const { playThap, playCardSelect, playCardPass, playTurnAlert, playTablaTick } = useSound();
  const [thapRippling, setThapRippling] = useState(false);

  // Play turn alert sound when turn passes to the user
  const prevTurnRef = useRef(false);
  useEffect(() => {
    if (isYourTurn && !prevTurnRef.current) {
      playTurnAlert();
    }
    prevTurnRef.current = isYourTurn;
  }, [isYourTurn, playTurnAlert]);

  // Play countdown tabla tick when 5 seconds remain and it is the player's turn
  const prevSecRef = useRef(secondsLeft);
  useEffect(() => {
    if (
      isYourTurn &&
      secondsLeft <= 5 &&
      secondsLeft > 0 &&
      secondsLeft !== prevSecRef.current
    ) {
      playTablaTick();
    }
    prevSecRef.current = secondsLeft;
  }, [isYourTurn, secondsLeft, playTablaTick]);

  const keyboardShortcuts = usePreferenceStore((s) => s.preferences.keyboardShortcuts ?? true);
  const autoPassMode = usePreferenceStore((s) => s.preferences.autoPassMode ?? 'rightmost');
  const playerAvatar = usePreferenceStore((s) => s.preferences.playerAvatar ?? 'raja');

  const AVATAR_MAP = {
    raja: { label: 'Raja', icon: 'crown', role: 'Royal Collector' },
    dadi: { label: 'Dadi', icon: 'elderly_woman', role: 'Wise Matriarch' },
    chacha: { label: 'Chacha ji', icon: 'face', role: 'Baithak Elder' },
    chhotu: { label: 'Chhotu', icon: 'bolt', role: 'Speedster' },
    chai: { label: 'Chai Master', icon: 'emoji_food_beverage', role: 'Tea Enthusiast' },
  };
  const activeAvatar = AVATAR_MAP[playerAvatar] || AVATAR_MAP.raja;

  // Auto-pass on turn timeout
  const autoPassTriggeredRef = useRef(false);
  useEffect(() => {
    if (!isYourTurn) {
      autoPassTriggeredRef.current = false;
      return;
    }
    if (secondsLeft === 0 && !autoPassTriggeredRef.current && state.yourHand?.length > 0) {
      autoPassTriggeredRef.current = true;
      let cardToPass = null;
      if (autoPassMode === 'random') {
        const counts = {};
        state.yourHand.forEach((c) => { counts[c.type || c.suit] = (counts[c.type || c.suit] || 0) + 1; });
        const sorted = [...state.yourHand].sort((a, b) => (counts[a.type || a.suit] || 0) - (counts[b.type || b.suit] || 0));
        cardToPass = sorted[0];
      } else {
        cardToPass = state.yourHand[state.yourHand.length - 1];
      }
      if (cardToPass) {
        onSelectCard(cardToPass.id);
        setTimeout(() => {
          onConfirmPass();
        }, 150);
      }
    }
  }, [isYourTurn, secondsLeft, autoPassMode, state.yourHand, onSelectCard, onConfirmPass]);

  // Keyboard shortcut controls: Space/Enter = THAP slam, 1-4 = Card selection
  useEffect(() => {
    if (!keyboardShortcuts) return;
    function handleKeyDown(e) {
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleThapSlam();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        const idx = Number(e.key) - 1;
        if (state.yourHand?.[idx]) {
          handleCardSelect(state.yourHand[idx].id);
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcuts, state.yourHand]);

  // Center table THAP slap action
  function handleThapSlam() {
    playThap();
    setThapRippling(true);
    setTimeout(() => setThapRippling(false), 400);
  }

  function handleCardSelect(id) {
    playCardSelect();
    onSelectCard(id);
  }

  function handlePass() {
    playCardPass();
    onConfirmPass();
  }

  // Filter out the user themselves from opponents to avoid displaying self as opponent
  const realOpponents = state.opponents.filter(
    (o) => userId == null || Number(o.id) !== Number(userId)
  );
  const currentTurnName =
    realOpponents.find((o) => Number(o.id) === Number(state.currentTurnPlayerId))?.username ??
    (isYourTurn ? 'You' : 'Table');
  const selectedCard = state.yourHand.find((c) => c.id === selectedCardId);
  const passToName = realOpponents[0]?.username ?? 'the next player';

  // Distribute opponents around top/left/right of the circle.
  const top = realOpponents.filter((_, i) => i % 3 === 0);
  const left = realOpponents.filter((_, i) => i % 3 === 1);
  const right = realOpponents.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex flex-col items-center gap-space-lg w-full">
      {top.length > 0 && (
        <div className="flex justify-center gap-space-md">
          {top.map((opp) => (
            <OpponentChip
              key={opp.id}
              opponent={opp}
              isCurrentTurn={state.currentTurnPlayerId === opp.id}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between w-full max-w-3xl gap-space-md">
        <div className="flex flex-col gap-space-md">
          {left.map((opp) => (
            <OpponentChip
              key={opp.id}
              opponent={opp}
              isCurrentTurn={state.currentTurnPlayerId === opp.id}
              align="start"
            />
          ))}
        </div>

        {/* Center circle with radiant glow aura */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <div
            className={`w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-surface-container to-surface-container-high dark:from-surface-container-low dark:to-surface-container shadow-2xl flex items-center justify-center relative p-3 transition-all duration-500 ${
              isYourTurn
                ? 'glow-gold-pulse ring-4 ring-secondary-container/80 shadow-[0_0_60px_rgba(254,166,25,0.45)]'
                : 'shadow-xl hover:shadow-2xl'
            }`}
          >
            {/* Concentric rotating ornamental dashed rings */}
            <div className="absolute inset-2 rounded-full border-dashed border-2 border-secondary/35 pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-5 rounded-full border-dotted border border-primary/25 pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />

            {/* Turn status banner */}
            <div
              className={`absolute -top-6 px-space-md py-space-xs rounded-full shadow-lg flex items-center gap-space-xs z-30 whitespace-nowrap transition-all duration-300 ${
                isYourTurn
                  ? 'bg-secondary-container text-on-secondary-container glow-gold scale-105 font-bold'
                  : 'bg-surface-container-lowest/95 dark:bg-surface-container-high text-on-surface border border-outline-variant/50'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isYourTurn ? 'bg-primary animate-ping' : 'bg-secondary-container animate-pulse'
                }`}
              />
              <span className="font-headline-sm text-headline-sm">
                {isYourTurn ? 'Your Turn' : `${currentTurnName}'s Turn`}
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-center">
              <TurnTimer turnDeadline={state.turnDeadline} />
              <div className="absolute flex flex-col items-center justify-center z-20">
                {/* Interactive THAP center button with visceral slap sound */}
                <button
                  type="button"
                  onClick={handleThapSlam}
                  aria-label="Slap the table - THAP!"
                  title="Slap the table (THAP!)"
                  className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-surface-container-high dark:bg-surface-container text-on-surface shadow-xl flex flex-col items-center justify-center p-space-sm transition-all cursor-pointer active:scale-90 hover:scale-105 select-none focus:outline-none focus:ring-4 focus:ring-primary ${
                    thapRippling ? 'scale-90 ring-8 ring-primary/80 glow-kumkum' : ''
                  }`}
                >
                  <div className="absolute inset-2 rounded-full border-dashed border-2 border-primary/40 animate-pulse pointer-events-none" />
                  <Icon
                    name="pan_tool"
                    size={28}
                    className="text-primary drop-shadow-[0_2px_8px_rgba(185,28,28,0.4)] pointer-events-none"
                  />
                  <span className="font-display-lg text-[28px] tracking-tight leading-none mt-1 text-glow-gold pointer-events-none">
                    THAP!
                  </span>
                  <span className="font-label-sm text-label-sm uppercase font-bold tracking-widest opacity-85 pointer-events-none">
                    Tap to Slam
                  </span>
                </button>

                <div className="mt-2 flex items-center gap-space-xs bg-surface-container-lowest/90 dark:bg-surface-container-highest/90 px-space-sm py-0.5 rounded-full shadow-sm border border-outline-variant/40">
                  <Icon
                    name="timer"
                    size={16}
                    className={secondsLeft <= 5 ? 'text-primary animate-bounce' : 'text-secondary'}
                  />
                  <span
                    className={`font-label-md text-label-md font-bold ${
                      secondsLeft <= 5 ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {secondsLeft}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-space-md">
          {right.map((opp) => (
            <OpponentChip
              key={opp.id}
              opponent={opp}
              isCurrentTurn={state.currentTurnPlayerId === opp.id}
              align="end"
            />
          ))}
        </div>
      </div>

      {/* Selection action bar */}
      <div
        className={`flex items-center gap-space-md bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/60 px-space-lg py-space-xs rounded-full shadow-2xl transition-all duration-300 ${
          selectedCard
            ? 'opacity-100 scale-100 glow-gold'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-space-xs">
          <Icon name="check_circle" size={20} className="text-secondary" />
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            Parchi Selected:{' '}
            <strong className="text-primary dark:text-secondary-container font-title-md">
              {selectedCard?.label}
            </strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handlePass}
          disabled={!isYourTurn}
          className="px-space-md py-space-xs rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg shadow-md flex items-center gap-space-xs transition-all active:scale-95 disabled:opacity-40 hover:glow-kumkum"
        >
          <span>Pass to {passToName}</span>
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>

      {/* Your hand */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="flex items-center justify-between w-full px-space-md mb-space-xs">
          <div className="flex items-center gap-space-sm">
            <div
              className={`flex items-center gap-space-xs font-label-sm text-label-sm font-bold transition-colors ${
                isYourTurn ? 'text-primary dark:text-secondary-container' : 'text-secondary'
              }`}
            >
              <Icon name="touch_app" size={16} />
              <span>{isYourTurn ? 'Tap a chit to select, then pass' : 'Waiting for your turn…'}</span>
            </div>
            {/* Player Persona Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-highest border border-outline-variant/60 text-[11px] font-bold text-on-surface">
              <Icon name={activeAvatar.icon} size={13} className="text-secondary" />
              <span>{activeAvatar.label}</span>
            </div>
          </div>
          <span className="font-mono text-body-sm text-on-surface-variant">
            Turn #{state.turnNumber}
          </span>
        </div>
        <div
          className={`w-full rounded-2xl border-2 border-dashed transition-all duration-500 bg-surface-container/60 dark:bg-surface-container-low/80 py-space-md backdrop-blur-sm ${
            isYourTurn
              ? 'border-secondary-container/70 shadow-[0_0_25px_rgba(254,166,25,0.18)]'
              : 'border-outline-variant/60 shadow-inner'
          }`}
        >
          <PlayerHand
            hand={state.yourHand}
            selectedCardId={selectedCardId}
            onSelect={handleCardSelect}
            disabled={!isYourTurn}
          />
        </div>
      </div>
    </div>
  );
}
