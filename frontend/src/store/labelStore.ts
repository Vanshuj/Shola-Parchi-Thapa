import { create } from 'zustand';
import type { LabelMap } from '@/types/label';
import { labelApi } from '@/api/labelApi';

interface LabelState {
  labels: LabelMap | null;
  loading: boolean;
  fetch: () => Promise<void>;
  save: (labels: LabelMap) => Promise<void>;
  reset: () => Promise<void>;
}

const DEFAULT_LABELS: LabelMap = {
  TYPE_1: 'Type 1',
  TYPE_2: 'Type 2',
  TYPE_3: 'Type 3',
  TYPE_4: 'Type 4',
};

export const useLabelStore = create<LabelState>((set) => ({
  labels: null,
  loading: false,
  fetch: async () => {
    set({ loading: true });
    try {
      const labels = await labelApi.getLabels();
      set({ labels, loading: false });
    } catch {
      set({ labels: DEFAULT_LABELS, loading: false });
    }
  },
  save: async (labels) => {
    const saved = await labelApi.updateLabels(labels);
    set({ labels: saved });
  },
  reset: async () => {
    await labelApi.reset();
    set({ labels: DEFAULT_LABELS });
  },
}));
