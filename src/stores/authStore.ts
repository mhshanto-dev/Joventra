import { create } from 'zustand';
import { User, Role } from '../types';
import { apiClient } from '../lib/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('hireloop_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem('hireloop_token'),
  isAuthenticated: !!localStorage.getItem('hireloop_token'),
  isLoading: true,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('hireloop_token', token);
    localStorage.setItem('hireloop_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  setUser: (user: User) => {
    localStorage.setItem('hireloop_user', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('hireloop_token');
      localStorage.removeItem('hireloop_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  fetchCurrentUser: async () => {
    const token = localStorage.getItem('hireloop_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await apiClient.get('/auth/me');
      if (response.data.success && response.data.data?.user) {
        const user = response.data.data.user;
        localStorage.setItem('hireloop_user', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        get().logout();
      }
    } catch (error) {
      get().logout();
    }
  },
}));

// Listen for global logout event
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().logout();
  });
}
