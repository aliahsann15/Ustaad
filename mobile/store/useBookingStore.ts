import { create } from 'zustand';

interface Provider {
  _id: string;
  name: string;
  skills: string[];
  location: { lat: number; lng: number };
  distance?: number;
  priceEstimate?: number;
}

interface BookingState {
  currentRequest: string | null;
  status: 'idle' | 'matching' | 'matched' | 'en_route' | 'completed';
  agentLogs: string[];
  matchedProvider: Provider | null;
  setRequest: (request: string) => void;
  setStatus: (status: BookingState['status']) => void;
  addAgentLog: (log: string) => void;
  setProvider: (provider: Provider) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentRequest: null,
  status: 'idle',
  agentLogs: [],
  matchedProvider: null,
  setRequest: (request) => set({ currentRequest: request }),
  setStatus: (status) => set({ status }),
  addAgentLog: (log) => set((state) => ({ agentLogs: [...state.agentLogs, log] })),
  setProvider: (provider) => set({ matchedProvider: provider }),
  clearBooking: () => set({ currentRequest: null, status: 'idle', agentLogs: [], matchedProvider: null }),
}));
