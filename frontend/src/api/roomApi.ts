import axiosClient from './axiosClient';
import type { RoomResponse } from '@/types/room';

export const roomApi = {
  create: (maxPlayers: number, isPrivate: boolean) =>
    axiosClient.post<RoomResponse>('/rooms', { maxPlayers, isPrivate }).then((r) => r.data),

  get: (code: string) => axiosClient.get<RoomResponse>(`/rooms/${code}`).then((r) => r.data),

  join: (code: string) => axiosClient.post<RoomResponse>(`/rooms/${code}/join`).then((r) => r.data),

  leave: (code: string) => axiosClient.post(`/rooms/${code}/leave`),

  start: (code: string) => axiosClient.post<{ gameId: string }>(`/rooms/${code}/start`).then((r) => r.data),
};
