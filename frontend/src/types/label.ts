import type { CardType } from './game';

export type LabelMap = Record<CardType, string>;

export interface LabelPreset {
  id: string;
  name: string;
  labels: LabelMap;
}
