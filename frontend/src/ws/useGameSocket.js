import { useEffect, useRef } from 'react';
import { GameSocket } from './gameSocket';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { useChatStore } from '@/store/chatStore';
/** Opens a live game socket for the given gameId and tears it down on unmount. */
export function useGameSocket(gameId) {
    const token = useAuthStore((s) => s.token);
    const userId = useAuthStore((s) => s.userId);
    const setState = useGameStore((s) => s.setState);
    const addChat = useChatStore((s) => s.addMessage);
    const socketRef = useRef(null);
    useEffect(() => {
        if (!gameId || !token)
            return;
        const socket = new GameSocket(token, gameId, userId, {
            onState: setState,
            onChat: addChat,
            onError: (err) => console.error('Game socket error:', err.code, err.message),
        });
        socketRef.current = socket;
        return () => {
            socket.dispose();
            socketRef.current = null;
        };
    }, [gameId, token, userId, setState, addChat]);
    return {
        passCard: (cardId) => socketRef.current?.passCard(cardId),
        sendChat: (text) => socketRef.current?.sendChat(text),
    };
}
