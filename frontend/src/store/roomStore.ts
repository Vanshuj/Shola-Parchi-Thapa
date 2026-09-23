import { create } from 'zustand';
import type { RoomResponse } from '@/types/room';

interface RoomState {
  room: RoomResponse | null;
  setRoom: (room: RoomResponse) => void;
  clear: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  setRoom: (room) => set({ room }),
  clear: () => set({ room: null }),
}));
