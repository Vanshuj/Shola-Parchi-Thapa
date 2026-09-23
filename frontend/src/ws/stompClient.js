import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
let client = null;
let currentToken = null;
const connectListeners = new Set();
export function getStompClient(token) {
    if (client && currentToken === token) {
        return client;
    }
    if (client && currentToken !== token) {
        client.deactivate();
        client = null;
    }
    currentToken = token;
    client = new Client({
        webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws'),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
    });
    client.onConnect = () => {
        connectListeners.forEach((cb) => {
            try {
                cb();
            }
            catch (err) {
                console.error('Error in STOMP connect listener:', err);
            }
        });
    };
    return client;
}
export function onStompConnect(callback) {
    connectListeners.add(callback);
    if (client?.connected) {
        try {
            callback();
        }
        catch (err) {
            console.error('Error in STOMP connect listener:', err);
        }
    }
    return () => {
        connectListeners.delete(callback);
    };
}
export function disconnectStompClient() {
    connectListeners.clear();
    client?.deactivate();
    client = null;
    currentToken = null;
}
