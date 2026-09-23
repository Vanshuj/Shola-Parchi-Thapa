import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameSocket } from '@/ws/useGameSocket';
import { useGameStore } from '@/store/gameStore';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { gameApi } from '@/api/gameApi';
import GameTable from '@/components/game/GameTable';
import ChatPanel from '@/components/game/ChatPanel';
import WinnerBanner from '@/components/game/WinnerBanner';
import MarigoldConfetti from '@/components/nostalgia/MarigoldConfetti';
import ChaiBreakToast from '@/components/nostalgia/ChaiBreakToast';
import Icon from '@/components/common/Icon';
import Loader from '@/components/common/Loader';

export default function GameTablePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const state = useGameStore((s) => s.state);
  const setState = useGameStore((s) => s.setState);
  const messages = useChatStore((s) => s.messages);
  const userId = useAuthStore((s) => s.userId);
  const { passCard, sendChat } = useGameSocket(gameId ?? null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;
    gameApi.get(gameId).then(setState).catch(() => {});
  }, [gameId, setState]);

  function handleConfirmPass() {
    if (!selectedCardId) return;
    passCard(selectedCardId);
    setSelectedCardId(null);
  }

  if (!state) return <Loader label="Dealing the parchis…" />;

  const isFinished = state.status === 'FINISHED';
  const winnerOpponent = state.opponents.find((o) => o.id === state.winnerId);
  const winnerUsername = state.winnerId === userId ? 'You' : winnerOpponent?.username ?? 'A player';

  return (
    <div className="w-full">
      {/* Room info bar */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant px-space-md lg:px-margin py-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-md">
          <span className="flex items-center gap-1 font-label-sm text-label-sm uppercase text-on-surface-variant">
            Room Code <strong className="text-on-surface tracking-widest">{state.roomCode}</strong>
          </span>
          <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
            <Icon name="style" size={14} /> Turn {state.turnNumber} &bull; {state.yourHand.length + state.opponents.reduce((s, o) => s + o.cardCount, 0)} Parchis in Play
          </span>
        </div>
        <span className="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
          <Icon name="auto_fix_high" size={16} /> Nostalgia FX
        </span>
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
        />
      )}
    </div>
  );
}
