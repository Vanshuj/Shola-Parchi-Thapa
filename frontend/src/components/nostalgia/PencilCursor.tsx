import { useEffect } from 'react';
import { useNostalgia } from '@/hooks/useNostalgia';

const PENCIL_CURSOR_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M2 22l1-5 12-12 4 4-12 12z' fill='%23B91C1C'/%3E%3Cpath d='M15 5l4 4' stroke='%232e1500' stroke-width='1'/%3E%3C/svg%3E\") 0 24, auto";

/** Swaps the document cursor for a hand-drawn pencil when Tier-2 motion is enabled. */
export default function PencilCursor() {
  const { cardAnimations } = useNostalgia();

  useEffect(() => {
    document.body.style.cursor = cardAnimations ? PENCIL_CURSOR_SVG : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [cardAnimations]);

  return null;
}
