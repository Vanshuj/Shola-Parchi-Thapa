import axiosClient from './axiosClient';
export const gameApi = {
    get: (gameId) => axiosClient.get(`/games/${gameId}`).then((r) => r.data),
    history: (gameId) => axiosClient.get(`/games/${gameId}/history`).then((r) => r.data),
};
