import { create } from 'zustand';
import { Lead, Campaign } from '../types';

export type ViewId = 'dashboard' | 'leads' | 'leads-detail' | 'analytics' | 'automations' | 'settings';

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface AppState {
  currentView: ViewId;
  selectedLead: Lead | null;
  user: User | null;
  campaigns: Campaign[];
  setView: (view: ViewId) => void;
  selectLead: (lead: Lead | null) => void;
  setUser: (user: User | null) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  selectedLead: null,
  user: {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@linkly.ai',
    organization: 'Acme Corp',
  },
  campaigns: [],
  setView: (view) => set({ currentView: view }),
  selectLead: (lead) =>
    set({
      selectedLead: lead,
      currentView: lead ? 'leads-detail' : 'leads',
    }),
  setUser: (user) => set({ user }),
  setCampaigns: (campaigns) => set({ campaigns }),
}));