import { motion } from 'framer-motion';
import { CARD_TYPE_GLYPH } from '@/utils/cardIcons';
import { useNostalgia } from '@/hooks/useNostalgia';
import HandDrawnBorder from '@/components/nostalgia/HandDrawnBorder';
const TYPE_COLORS = {
    TYPE_1: 'bg-primary-container text-primary-on-container shadow-[0_4px_12px_rgba(185,28,28,0.25)]',
    TYPE_2: 'bg-secondary-container text-secondary-on-container shadow-[0_4px_12px_rgba(254,166,25,0.25)]',
    TYPE_3: 'bg-tertiary-container text-tertiary-on-container shadow-[0_4px_12px_rgba(64,89,170,0.25)]',
    TYPE_4: 'bg-surface-high text-ink border border-outline-variant/50 shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
};
export default function ParchiCard({ card, selected, disabled, onClick, rotationSeed = 0 }) {
    const { cardAnimations } = useNostalgia();
    const rotation = cardAnimations ? (((rotationSeed * 37) % 7) - 3) : 0;
    return (<motion.button type="button" layoutId={cardAnimations ? `parchi-${card.id}` : undefined} onClick={onClick} disabled={disabled} aria-pressed={selected} aria-label={`Parchi labeled ${card.label}`} whileHover={!disabled && cardAnimations ? { y: -8, scale: 1.05, rotate: 0 } : undefined} whileTap={!disabled ? { scale: 0.96 } : undefined} style={{ rotate: `${rotation}deg` }} className={`relative w-20 h-28 md:w-24 md:h-32 shrink-0 rounded-lg shadow-md transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40 disabled:cursor-not-allowed ${selected
            ? 'ring-4 ring-kumkum ring-offset-2 dark:ring-offset-surface scale-105 -translate-y-2 glow-kumkum-pulse shadow-[0_12px_24px_rgba(185,28,28,0.45)]'
            : 'hover:shadow-xl hover:drop-shadow-[0_8px_16px_rgba(254,166,25,0.3)]'}`}>
      <HandDrawnBorder className="h-full w-full">
        <div className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg p-2 transition-transform ${TYPE_COLORS[card.type]}`}>
          <span className="text-2xl drop-shadow-sm" aria-hidden="true">
            {CARD_TYPE_GLYPH[card.type]}
          </span>
          <span className="font-hand text-lg leading-tight text-center break-words select-none">{card.label}</span>
        </div>
      </HandDrawnBorder>
    </motion.button>);
}
