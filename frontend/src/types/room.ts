export interface RoomResponse {
  roomCode: string;
  status: 'WAITING' | 'ACTIVE' | 'FINISHED';
  hostUserId: number;
  maxPlayers: number;
  private: boolean;
  seatedUsernames: string[];
  gameId: string | null;
}
