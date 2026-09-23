import type { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { getStompClient, onStompConnect } from './stompClient';
import type { ChatMessage, GameStateDTO } from '@/types/game';

export interface GameSocketHandlers {
  onState: (state: GameStateDTO) => void;
  onChat?: (message: ChatMessage) => void;
  onError?: (error: { code: string; message: string }) => void;
}

export class GameSocket {
  private client: Client;
  private subscriptions: StompSubscription[] = [];
  private unsubscribeConnect: (() => void) | null = null;
  private isDisposed = false;
  private effectiveUserId: number | null;

  constructor(
    token: string,
    private gameId: string,
    userId: number | null,
    private handlers: GameSocketHandlers
  ) {
    this.effectiveUserId = userId ?? this.extractUserIdFromToken(token);
    this.client = getStompClient(token);

    // Register connect listener that activates subscriptions once connected
    this.unsubscribeConnect = onStompConnect(() => {
      if (!this.isDisposed) {
        this.subscribeAll();
      }
    });

    if (!this.client.active) {
      this.client.activate();
    } else if (this.client.connected) {
      this.subscribeAll();
    }
  }

  private extractUserIdFromToken(token: string): number | null {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1]));
        const id = Number(payload.sub);
        return isNaN(id) ? null : id;
      }
    } catch {
      // ignore
    }
    return null;
  }

  private subscribeAll() {
    if (!this.client.connected || this.isDisposed) return;

    // Clean up any existing subscriptions before re-subscribing
    this.subscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch {
        // ignore
      }
    });
    this.subscriptions = [];

    try {
      // 1. General game topic (spectator broadcast)
      this.subscriptions.push(
        this.client.subscribe(`/topic/game/${this.gameId}`, (msg: IMessage) => {
          try {
            const dto = JSON.parse(msg.body) as GameStateDTO;
            // If the user is seated in this room, do not let spectator broadcast overwrite private state!
            // Spectator broadcast has empty yourHand and places this user in opponents.
            const isSeated =
              this.effectiveUserId != null &&
              dto.opponents?.some((o) => Number(o.id) === Number(this.effectiveUserId));
            if (isSeated) {
              return;
            }
            this.handlers.onState(dto);
          } catch (err) {
            console.error('Failed to parse game state message', err);
          }
        })
      );

      // 2. Personal topic with your hand if userId is known
      if (this.effectiveUserId != null) {
        this.subscriptions.push(
          this.client.subscribe(`/topic/game/${this.gameId}/for/${this.effectiveUserId}`, (msg: IMessage) => {
            try {
              const dto = JSON.parse(msg.body) as GameStateDTO;
              this.handlers.onState(dto);
            } catch (err) {
              console.error('Failed to parse personal game state', err);
            }
          })
        );
        this.subscriptions.push(
          this.client.subscribe(`/user/queue/game/${this.gameId}`, (msg: IMessage) => {
            try {
              const dto = JSON.parse(msg.body) as GameStateDTO;
              this.handlers.onState(dto);
            } catch (err) {
              console.error('Failed to parse queue game state', err);
            }
          })
        );
      }

      // 3. Chat topic
      if (this.handlers.onChat) {
        this.subscriptions.push(
          this.client.subscribe(`/topic/game/${this.gameId}/chat`, (msg: IMessage) => {
            try {
              this.handlers.onChat?.(JSON.parse(msg.body) as ChatMessage);
            } catch (err) {
              console.error('Failed to parse chat message', err);
            }
          })
        );
      }

      // 4. Error queue
      if (this.handlers.onError) {
        this.subscriptions.push(
          this.client.subscribe('/user/queue/errors', (msg: IMessage) => {
            try {
              this.handlers.onError?.(JSON.parse(msg.body));
            } catch (err) {
              console.error('Failed to parse error message', err);
            }
          })
        );
      }

      // Notify ready
      this.client.publish({ destination: `/app/game/${this.gameId}/ready`, body: '{}' });
    } catch (err) {
      console.warn('Error establishing game subscriptions:', err);
    }
  }

  passCard(cardId: string) {
    if (!this.client.connected) {
      console.warn('Cannot pass card: STOMP client is not connected');
      return;
    }
    this.client.publish({
      destination: `/app/game/${this.gameId}/pass`,
      body: JSON.stringify({ cardId }),
    });
  }

  sendChat(text: string) {
    if (!this.client.connected) {
      console.warn('Cannot send chat: STOMP client is not connected');
      return;
    }
    this.client.publish({
      destination: `/app/game/${this.gameId}/chat`,
      body: JSON.stringify({ text }),
    });
  }

  dispose() {
    this.isDisposed = true;
    if (this.unsubscribeConnect) {
      this.unsubscribeConnect();
      this.unsubscribeConnect = null;
    }
    this.subscriptions.forEach((sub) => {
      try {
        sub.unsubscribe();
      } catch {
        // ignore
      }
    });
    this.subscriptions = [];
  }
}
