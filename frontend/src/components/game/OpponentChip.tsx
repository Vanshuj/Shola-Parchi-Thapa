import type { OpponentDTO } from '@/types/game';
import Icon from '@/components/common/Icon';

interface OpponentChipProps {
  opponent: OpponentDTO;
  isCurrentTurn: boolean;
  align?: 'start' | 'center' | 'end';
}

export default function OpponentChip({ opponent, isCurrentTurn, align = 'center' }: OpponentChipProps) {
  const alignClass = align === 'start' ? 'items-start' : align === 'end' ? 'items-end' : 'items-center';

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <div
        className={`relative bg-surface-container-lowest/95 dark:bg-surface-container-high/90 border border-outline-variant/50 p-space-sm rounded-2xl shadow-xl flex flex-col items-center gap-space-xs w-32 transition-all duration-300 ${
          isCurrentTurn
            ? 'ring-4 ring-secondary-container/90 glow-gold-pulse shadow-[0_0_30px_rgba(254,166,25,0.45)] scale-105'
            : 'hover:shadow-2xl'
        }`}
      >
        {isCurrentTurn && (
          <div className="absolute -top-3 bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded-full font-label-sm text-label-sm font-bold shadow-md flex items-center gap-1 glow-gold animate-bounce">
            <Icon name="play_circle" size={12} /> ACTIVE
          </div>
        )}
        <div className="relative mt-2">
          <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shadow-md">
            <Icon name="face" size={28} />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[11px] font-bold px-1.5 rounded-full">
            {opponent.cardCount}
          </span>
        </div>
        <span className="font-headline-sm text-headline-sm text-on-surface truncate max-w-full">
          {opponent.username}
        </span>
        <div className="bg-primary/10 text-primary px-space-xs py-0.5 rounded font-label-sm text-label-sm font-semibold">
          {isCurrentTurn ? 'Discarding chit\u2026' : 'Waiting\u2026'}
        </div>
      </div>
    </div>
  );
}
