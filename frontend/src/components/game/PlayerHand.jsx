import ParchiCard from './ParchiCard';
import { usePreferenceStore } from '@/store/preferenceStore';

export default function PlayerHand({ hand, selectedCardId, onSelect, disabled }) {
  const autoGroup = usePreferenceStore((s) => s.preferences.autoGroupCards ?? true);
  const displayHand = autoGroup
    ? [...hand].sort((a, b) => (a.type || '').localeCompare(b.type || ''))
    : hand;

  return (
    <div className="flex flex-wrap items-end justify-center gap-3 p-4" role="group" aria-label="Your hand">
      {displayHand.map((card, i) => (
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
