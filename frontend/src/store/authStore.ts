import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: number | null;
  username: string | null;
  token: string | null;
  setAuth: (userId: number, username: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      token: null,
      setAuth: (userId, username, token) => set({ userId, username, token }),
      logout: () => set({ userId: null, username: null, token: null }),
    }),
    { name: 'spt-auth' }
  )
);
