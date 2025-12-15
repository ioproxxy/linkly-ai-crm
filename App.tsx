import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LeadList } from './components/LeadList';
import { LeadDetail } from './components/LeadDetail';
import { AIChat } from './components/AIChat';
import { MOCK_LEADS } from './services/mockData';
import { Lead } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Real-time update simulation (Polling effect)
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate incoming data socket
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentView('leads-detail');
  };

  const handleBackToLeads = () => {
    setSelectedLead(null);
    setCurrentView('leads');
  };

  const renderContent = () => {
    if (currentView === 'leads-detail' && selectedLead) {
      return <LeadDetail lead={selectedLead} onBack={handleBackToLeads} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadList leads={MOCK_LEADS} onSelectLead={handleSelectLead} />;
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

  return (
    <div className="flex h-screen bg-[#f3f4f6]">
      <Sidebar currentView={currentView === 'leads-detail' ? 'leads' : currentView} setView={setCurrentView} />
      
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
