import type { CardType } from '@/types/game';

/** Fallback glyph shown behind/alongside a custom label for quick type recognition. */
export const CARD_TYPE_GLYPH: Record<CardType, string> = {
  TYPE_1: '●',
  TYPE_2: '■',
  TYPE_3: '▲',
  TYPE_4: '◆',
};
