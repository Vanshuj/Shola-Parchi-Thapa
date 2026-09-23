import { useNostalgia } from '@/hooks/useNostalgia';

/** Falling marigold-petal confetti, shown briefly on a win. Skips entirely under reduced motion. */
export default function MarigoldConfetti({ active }: { active: boolean }) {
  const { cardAnimations } = useNostalgia();
  if (!active || !cardAnimations) return null;

  const petals = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {petals.map((_, i) => (
        <span
          key={i}
          className="absolute top-0 animate-petal-fall text-2xl"
          style={{
            left: `${(i * 137) % 100}%`,
            animationDelay: `${(i % 8) * 0.3}s`,
          }}
        >
          🌼
        </span>
      ))}
    </div>
  );
}
