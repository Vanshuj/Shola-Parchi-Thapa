import type { LabelMap } from '@/types/label';

export const DEFAULT_LABELS: LabelMap = {
  TYPE_1: 'Type 1',
  TYPE_2: 'Type 2',
  TYPE_3: 'Type 3',
  TYPE_4: 'Type 4',
};

export const BUILTIN_PRESETS: { id: string; name: string; labels: LabelMap }[] = [
  { id: 'family', name: 'Family Pack', labels: { TYPE_1: 'Mummy', TYPE_2: 'Papa', TYPE_3: 'Didi', TYPE_4: 'Bhaiya' } },
  { id: 'cricket', name: 'Cricket Pack', labels: { TYPE_1: 'Googly', TYPE_2: 'Sixer', TYPE_3: 'Wicket', TYPE_4: 'Century' } },
  { id: 'festival', name: 'Festival Pack', labels: { TYPE_1: '🪅', TYPE_2: '🪔', TYPE_3: '✨', TYPE_4: '🎇' } },
  { id: 'bollywood', name: 'Bollywood Pack', labels: { TYPE_1: 'Hero', TYPE_2: 'Heroine', TYPE_3: 'Villain', TYPE_4: 'Comedian' } },
];
