import axiosClient from './axiosClient';
import type { AuthResponse } from '@/types/user';

export const authApi = {
  register: (username: string, email: string, password: string) =>
    axiosClient.post<AuthResponse>('/auth/register', { username, email, password }).then((r) => r.data),

  login: (email: string, password: string) =>
    axiosClient.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),
};
