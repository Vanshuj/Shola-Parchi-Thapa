import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gameApi } from '@/api/gameApi';
import type { MoveResponse } from '@/types/game';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import Icon from '@/components/common/Icon';

export default function ResultsPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [history, setHistory] = useState<MoveResponse[] | null>(null);

  useEffect(() => {
    if (!gameId) return;
    gameApi.history(gameId).then(setHistory);
  }, [gameId]);

  if (!history) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-space-md lg:px-margin py-space-xl">
      <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface flex items-center gap-space-sm">
        <Icon name="receipt_long" size={28} className="text-primary" /> Baithak recap
      </h1>
      <ol className="mt-space-lg space-y-space-xs">
        {history.map((move) => (
          <li
            key={move.turnNumber}
            className="rounded-lg bg-surface-container-low px-space-md py-space-sm font-body-md text-body-md text-on-surface-variant flex items-center gap-space-sm"
          >
            <span className="font-mono text-body-sm text-on-surface-variant w-16 shrink-0">Turn {move.turnNumber}</span>
            <span>
              Player {move.playerId} passed a <strong className="text-on-surface">{move.passedCardType.replace('_', ' ')}</strong>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-space-xl flex justify-center gap-space-sm">
        <Link to="/lobby">
          <Button>Back to Lobby</Button>
        </Link>
        <Link to="/leaderboard">
          <Button variant="ghost">View leaderboard</Button>
        </Link>
      </div>
    </div>
  );
}
