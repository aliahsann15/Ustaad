import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  token: string | null;
  userId: string | null;
  setAuthenticated: (status: boolean, phone?: string, token?: string, userId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  phoneNumber: null,
  token: null,
  userId: null,
  setAuthenticated: (status, phone, token, userId) => set({ 
    isAuthenticated: status, 
    phoneNumber: phone || null, 
    token: token || null, 
    userId: userId || null 
  }),
  logout: () => set({ isAuthenticated: false, phoneNumber: null, token: null, userId: null }),
}));
