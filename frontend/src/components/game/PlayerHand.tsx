import type { CardDTO } from '@/types/game';
import ParchiCard from './ParchiCard';

interface PlayerHandProps {
  hand: CardDTO[];
  selectedCardId: string | null;
  onSelect: (cardId: string) => void;
  disabled: boolean;
}

export default function PlayerHand({ hand, selectedCardId, onSelect, disabled }: PlayerHandProps) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 p-4" role="group" aria-label="Your hand">
      {hand.map((card, i) => (
        <ParchiCard
          key={card.id}
          card={card}
          rotationSeed={i}
          selected={selectedCardId === card.id}
          disabled={disabled}
          onClick={() => onSelect(card.id)}
        />
      ))}
    </div>
  );
}
