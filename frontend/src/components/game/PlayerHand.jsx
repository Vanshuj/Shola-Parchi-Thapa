import ParchiCard from './ParchiCard';
export default function PlayerHand({ hand, selectedCardId, onSelect, disabled }) {
    return (<div className="flex flex-wrap items-end justify-center gap-3 p-4" role="group" aria-label="Your hand">
      {hand.map((card, i) => (<ParchiCard key={card.id} card={card} rotationSeed={i} selected={selectedCardId === card.id} disabled={disabled} onClick={() => onSelect(card.id)}/>))}
    </div>);
}
