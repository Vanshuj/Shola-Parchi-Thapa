import axiosClient from './axiosClient';
import type { LeaderboardEntry } from '@/types/user';

export const leaderboardApi = {
  get: (limit = 100) =>
    axiosClient.get<LeaderboardEntry[]>('/leaderboard', { params: { limit } }).then((r) => r.data),
};
