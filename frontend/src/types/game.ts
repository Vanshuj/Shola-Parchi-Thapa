export type CardType = 'TYPE_1' | 'TYPE_2' | 'TYPE_3' | 'TYPE_4';

export interface CardDTO {
  id: string;
  type: CardType;
  label: string;
}

export interface OpponentDTO {
  id: number;
  username: string;
  cardCount: number;
  lastPassed: 'HIDDEN';
}

export type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED';

export interface GameStateDTO {
  gameId: string;
  roomCode: string;
  status: GameStatus;
  currentTurnPlayerId: number | null;
  turnDeadline: string | null;
  turnNumber: number;
  yourHand: CardDTO[];
  opponents: OpponentDTO[];
  winnerId: number | null;
}

export interface MoveResponse {
  turnNumber: number;
  playerId: number;
  passedCardType: CardType;
  timestamp: string;
}

export interface ChatMessage {
  from: string;
  text: string;
  timestamp: string;
}
