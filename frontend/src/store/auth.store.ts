import { create } from "zustand";
import * as authApi from "@/api/auth.api";

interface AuthState {
  user: any | null;
  loading: boolean;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const data = await authApi.getMe();
      set({ user: data.user });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await authApi.login({ email, password });
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      throw error;
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },
}));
