import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    userId: null,
    username: null,
    token: null,
    setAuth: (userId, username, token) => set({ userId, username, token }),
    logout: () => set({ userId: null, username: null, token: null }),
}), { name: 'spt-auth' }));
