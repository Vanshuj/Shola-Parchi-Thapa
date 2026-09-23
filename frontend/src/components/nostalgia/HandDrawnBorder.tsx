import type { ReactNode } from 'react';
import { useNostalgia } from '@/hooks/useNostalgia';

interface HandDrawnBorderProps {
  children: ReactNode;
  className?: string;
}

/** Wraps content in a slightly wobbly, hand-inked-looking border via an SVG rect with rough edges. */
export default function HandDrawnBorder({ children, className = '' }: HandDrawnBorderProps) {
  const { handDrawnBorders } = useNostalgia();

  if (!handDrawnBorders) {
    return <div className={`rounded-lg border border-outline-variant ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="8"
          fill="none"
          stroke="#5b403d"
          strokeWidth="1.5"
          strokeDasharray="1 0"
          style={{ filter: 'url(#wobble-edge)' }}
        />
        <filter id="wobble-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>
      <div className="relative rounded-lg p-px">{children}</div>
    </div>
  );
}
