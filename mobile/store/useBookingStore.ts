import { create } from 'zustand';

interface Provider {
  _id: string;
  name: string;
  skills: string[];
  location: { lat: number; lng: number };
  distance?: number;
  priceEstimate?: number;
  rating?: number;
  reviewCount?: number;
  specializationLevel?: 'basic' | 'intermediate' | 'expert';
  phoneNumber?: string;
  isVerified?: boolean;
  avatar?: string;
  tagline?: string;
  yearsExperience?: number;
}

interface PriceBreakdown {
  visitFee: number;
  distanceCost: number;
  urgencyAdjustment: number;
  totalEstimated: number;
}

interface BookingState {
  currentRequest: string | null;
  serviceRequestId: string | null;
  bookingId: string | null;
  status: 'idle' | 'matching' | 'matched' | 'en_route' | 'completed';
  activeCall: {
    callId: string;
    status: string;
    promptText?: string;
    providerName?: string;
    providerPhoneNumber?: string;
  } | null;
  agentLogs: string[];
  matchedProvider: Provider | null;
  priceBreakdown: PriceBreakdown | null;
  otherProviders: Provider[];
  setRequest: (request: string) => void;
  setStatus: (status: BookingState['status']) => void;
  addAgentLog: (log: string) => void;
  setProvider: (provider: Provider) => void;
  setActiveCall: (call: BookingState['activeCall']) => void;
  setBackendResult: (payload: {
    serviceRequestId?: string | null;
    bookingId?: string | null;
    provider?: Provider | null;
    priceBreakdown?: PriceBreakdown | null;
    otherProviders?: Provider[] | null;
    status?: BookingState['status'];
  }) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  currentRequest: null,
  serviceRequestId: null,
  bookingId: null,
  status: 'idle',
  activeCall: null,
  agentLogs: [],
  matchedProvider: null,
  otherProviders: [],
  priceBreakdown: null,
  setRequest: (request) => set({ currentRequest: request }),
  setStatus: (status) => set({ status }),
  addAgentLog: (log) => set((state) => ({ agentLogs: [...state.agentLogs, log] })),
  setProvider: (provider) => set({ matchedProvider: provider }),
  setActiveCall: (call) => set({ activeCall: call }),
  setBackendResult: (payload) => set((state) => ({
    serviceRequestId: payload.serviceRequestId ?? state.serviceRequestId,
    bookingId: payload.bookingId ?? state.bookingId,
    matchedProvider: payload.provider ?? state.matchedProvider,
    priceBreakdown: payload.priceBreakdown ?? state.priceBreakdown,
    otherProviders: payload.otherProviders ?? state.otherProviders,
    status: payload.status ?? state.status,
  })),
  clearBooking: () => set({
    currentRequest: null,
    serviceRequestId: null,
    bookingId: null,
    status: 'idle',
    activeCall: null,
    agentLogs: [],
    matchedProvider: null,
    priceBreakdown: null,
  }),
}));
