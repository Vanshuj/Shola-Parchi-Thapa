import { create } from 'zustand';
import type { ChatEntry } from '@/types/chat';

interface ChatState {
  messages: ChatEntry[];
  addMessage: (message: ChatEntry) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message].slice(-100) })),
  clear: () => set({ messages: [] }),
}));
