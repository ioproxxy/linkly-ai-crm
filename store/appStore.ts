import { create } from 'zustand';
import { Lead, Campaign } from '../types';

export type ViewId = 'dashboard' | 'leads' | 'leads-detail' | 'analytics' | 'automations' | 'settings';

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface AppState {
  currentView: ViewId;
  selectedLead: Lead | null;
  user: User | null;
  accessToken: string | null;
  initializing: boolean;
  campaigns: Campaign[];
  setView: (view: ViewId) => void;
  selectLead: (lead: Lead | null) => void;
  setAuth: (user: User | null, token: string | null) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  setInitializing: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  selectedLead: null,
  user: null,
  accessToken: null,
  initializing: true,
  campaigns: [],
  setView: (view) => set({ currentView: view }),
  selectLead: (lead) =>
    set({
      selectedLead: lead,
      currentView: lead ? 'leads-detail' : 'leads',
    }),
  setAuth: (user, token) =>
    set({
      user,
      accessToken: token,
    }),
  setCampaigns: (campaigns) => set({ campaigns }),
  setInitializing: (value) => set({ initializing: value }),
}));