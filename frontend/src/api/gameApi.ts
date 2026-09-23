import axiosClient from './axiosClient';
import type { GameStateDTO, MoveResponse } from '@/types/game';

export const gameApi = {
  get: (gameId: string) => axiosClient.get<GameStateDTO>(`/games/${gameId}`).then((r) => r.data),
  history: (gameId: string) => axiosClient.get<MoveResponse[]>(`/games/${gameId}/history`).then((r) => r.data),
};
