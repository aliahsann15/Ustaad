import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  token: string | null;
  setAuthenticated: (status: boolean, phone?: string, token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  phoneNumber: null,
  token: null,
  setAuthenticated: (status, phone, token) => set({ isAuthenticated: status, phoneNumber: phone, token }),
  logout: () => set({ isAuthenticated: false, phoneNumber: null, token: null }),
}));
