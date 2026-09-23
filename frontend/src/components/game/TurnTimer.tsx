import { useTurnTimer } from '@/hooks/useTurnTimer';
import { TURN_DURATION_SECONDS } from '@/utils/constants';

const RADIUS = 84;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TurnTimer({ turnDeadline }: { turnDeadline: string | null }) {
  const secondsLeft = useTurnTimer(turnDeadline);
  const fraction = turnDeadline ? secondsLeft / TURN_DURATION_SECONDS : 0;
  const offset = CIRCUMFERENCE * (1 - fraction);
  const urgent = secondsLeft <= 5;

  return (
    <svg className="absolute w-56 h-56 sm:w-64 sm:h-64 -rotate-90 pointer-events-none" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={RADIUS} strokeWidth="8" className="stroke-surface-variant fill-none" />
      <circle
        cx="100"
        cy="100"
        r={RADIUS}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        className={`fill-none transition-all duration-1000 ${urgent ? 'stroke-primary' : 'stroke-secondary-container'}`}
      />
    </svg>
  );
}
