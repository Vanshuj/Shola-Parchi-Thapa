import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';
import type { GameStateDTO } from '@/types/game';

const SAMPLE_STATE: GameStateDTO = {
  gameId: 'g1',
  roomCode: 'ABC123',
  status: 'ACTIVE',
  currentTurnPlayerId: 42,
  turnDeadline: new Date().toISOString(),
  turnNumber: 3,
  yourHand: [{ id: 'c1', type: 'TYPE_1', label: 'Mummy' }],
  opponents: [{ id: 43, username: 'riya', cardCount: 4, lastPassed: 'HIDDEN' }],
  winnerId: null,
};

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.setState({ state: null });
  });

  it('updates state when a new WS message arrives (setState call)', () => {
    useGameStore.getState().setState(SAMPLE_STATE);
    expect(useGameStore.getState().state).toEqual(SAMPLE_STATE);
  });

  it('clears state on clear()', () => {
    useGameStore.getState().setState(SAMPLE_STATE);
    useGameStore.getState().clear();
    expect(useGameStore.getState().state).toBeNull();
  });
});
