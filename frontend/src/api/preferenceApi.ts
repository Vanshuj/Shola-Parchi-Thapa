import axiosClient from './axiosClient';
import type { Preferences } from '@/types/preference';

export const preferenceApi = {
  get: () => axiosClient.get<Preferences>('/users/me/preferences').then((r) => r.data),
  update: (partial: Partial<Preferences>) =>
    axiosClient.put<Preferences>('/users/me/preferences', partial).then((r) => r.data),
};
