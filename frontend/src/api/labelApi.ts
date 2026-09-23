import axiosClient from './axiosClient';
import type { LabelMap, LabelPreset } from '@/types/label';

export const labelApi = {
  getLabels: () => axiosClient.get<{ labels: LabelMap }>('/users/me/labels').then((r) => r.data.labels),

  updateLabels: (labels: LabelMap) =>
    axiosClient.put<{ labels: LabelMap; updatedAt: string }>('/users/me/labels', { labels }).then((r) => r.data.labels),

  updateOne: (cardType: string, label: string) =>
    axiosClient.put(`/users/me/labels/${cardType}`, { label }).then((r) => r.data),

  reset: () => axiosClient.delete('/users/me/labels'),

  presets: () => axiosClient.get<LabelPreset[]>('/labels/presets').then((r) => r.data),
};
