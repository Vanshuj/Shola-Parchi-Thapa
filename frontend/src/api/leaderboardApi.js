import axiosClient from './axiosClient';
export const leaderboardApi = {
    get: (limit = 100) => axiosClient.get('/leaderboard', { params: { limit } }).then((r) => r.data),
};
