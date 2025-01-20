import { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { postApi } from '@/lib/apiHelpers';


export interface AuthSlice {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<string>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [],
  [["zustand/persist", unknown]]
> = persist(
  (set, get) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        const response = await postApi('/auth/login', credentials);
        console.log("Response",response); 
        if (response?.user && response?.token) {
          set({ user: response.user, token: response.token });
          return `/${response.user.role.toLowerCase()}`;
        }
        throw new Error('Invalid response from server');
      } catch (error: any) {
        set({ error: error.message || 'Failed to login' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    register: async (data: FormData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await postApi('/auth/register', data);
        return response;
      } catch (error: any) {
        set({ error: error.message || 'Registration failed' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: () => {
      set({ user: null, token: null });
    },

    checkAuth: () => {
      const state = get();
      if (!state.token || !state.user) return false;

      try {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          state.logout();
          return false;
        }
        return true;
      } catch (error) {
        state.logout();
        return false;
      }
    },
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({ user: state.user, token: state.token }),
  }
);
