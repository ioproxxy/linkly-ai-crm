import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { AIChat } from './components/AIChat';
import { MOCK_LEADS } from './services/mockData';
import { fetchLeads } from './services/leadsService';
import { useAppStore } from './store/appStore';
import { AuthShell } from './components/auth/AuthShell';

const App: React.FC = () => {
  const currentView = useAppStore((s) => s.currentView);
  const selectedLead = useAppStore((s) => s.selectedLead);
  const selectLead = useAppStore((s) => s.selectLead);
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);
  const setAuth = useAppStore((s) => s.setAuth);
  const initializing = useAppStore((s) => s.initializing);
  const setInitializing = useAppStore((s) => s.setInitializing);

  // Real-time update simulation (Polling effect) & lead loading
  const [lastUpdate, setLastUpdate] = React.useState(new Date());
  const [leads, setLeads] = React.useState(MOCK_LEADS);
  const [leadsLoading, setLeadsLoading] = React.useState(false);

  useEffect(() => {
    // hydrate auth from localStorage once on boot
    if (initializing) {
      const raw = localStorage.getItem('linkly_auth');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed?.user && parsed?.accessToken) {
            setAuth(parsed.user, parsed.accessToken);
          }
        } catch {
          // ignore bad data
        }
      }
      setInitializing(false);
    }

    const loadLeads = async () => {
      setLeadsLoading(true);
      try {
        const apiLeads = await fetchLeads();
        if (Array.isArray(apiLeads) && apiLeads.length > 0) {
          setLeads(apiLeads);
        }
      } catch (e) {
        console.error('Failed to load leads from API, falling back to mock data', e);
        setLeads(MOCK_LEADS);
      } finally {
        setLeadsLoading(false);
      }
    };

    loadLeads();

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectLead = (lead: any) => {
    selectLead(lead);
  };

  const handleBackToLeads = () => {
    selectLead(null);
  };

  const renderContent = () => {
    if (currentView === 'leads-detail' && selectedLead) {
      return <LeadDetail lead={selectedLead} onBack={handleBackToLeads} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadList leads={leads} onSelectLead={handleSelectLead} isLoading={leadsLoading} />;
      case 'analytics':
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-xl font-semibold">Advanced Analytics Module</p>
                <p>Coming in next update</p>
            </div>
        );
      default:
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-xl font-semibold">Under Construction</p>
            </div>
        );
    }
  };

  if (!user || initializing) {
    return <AuthShell />;
  }

  return (
    <div className="flex h-screen bg-[#f3f4f6]">
      <Sidebar currentView={currentView === 'leads-detail' ? 'leads' : currentView} setView={setView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-gray-500 text-sm font-medium">
             Organization: <span className="text-gray-900 font-bold">Acme Corp</span>
           </h2>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-gray-400">System Online • Updated {lastUpdate.toLocaleTimeString()}</span>
           </div>
        </div>

        {renderContent()}
      </main>

      <AIChat />
    </div>
  );
};

export default App;
