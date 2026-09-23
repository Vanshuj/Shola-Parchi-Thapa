import { create } from 'zustand';
export const useChatStore = create((set) => ({
    messages: [],
    addMessage: (message) => set((s) => ({ messages: [...s.messages, message].slice(-100) })),
    clear: () => set({ messages: [] }),
}));
