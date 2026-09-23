import { useAuthStore } from '@/store/authStore';
export function useAuth() {
    const { userId, username, token, setAuth, logout } = useAuthStore();
    return { userId, username, token, isAuthenticated: !!token, setAuth, logout };
}
