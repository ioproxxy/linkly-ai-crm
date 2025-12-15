import React, { useState } from 'react';
import { Lead, MessageSender, AIAnalysisResult } from '../types';
import { analyzeLeadWithGemini } from '../services/geminiService';
import { ArrowLeft, BrainCircuit, MessageSquare, Clock, Globe, Loader2, Send } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  onBack: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onBack }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [draft, setDraft] = useState('');

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeLeadWithGemini(lead);
      setAnalysis(result);
      setDraft(result.draftReply);
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column: Thread & Actions */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{lead.name}</h2>
            <p className="text-gray-500 text-sm">{lead.company} • {lead.email}</p>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
            <span>Conversation History</span>
            <span className="text-xs font-normal text-gray-400">Campaign: {lead.campaignId}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {lead.history.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">No history yet. Lead is fresh.</div>
            ) : (
                lead.history.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === MessageSender.LEAD ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === MessageSender.LEAD 
                        ? 'bg-white border border-gray-200 text-gray-800' 
                        : 'bg-blue-600 text-white'
                    }`}>
                    <div className="text-xs opacity-70 mb-1 flex justify-between gap-4">
                        <span className="font-bold uppercase">{msg.sender}</span>
                        <span>{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                </div>
                ))
            )}
          </div>

          {/* Reply Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase">Reply Draft</span>
              {analysis && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    AI Generated
                </span>
              )}
            </div>
            <textarea 
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3 h-24 resize-none"
              placeholder="Write a reply or ask AI to draft one..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
              >
                {analyzing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                <span>{analyzing ? 'Analyzing...' : 'AI Analyze & Draft'}</span>
              </button>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
                <Send size={16} />
                <span>Send Reply</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Lead Info & AI Insights */}
      <div className="space-y-6">
        
        {/* Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Lead Details</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Globe size={16} className="text-gray-400" />
              <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                {lead.websiteUrl || 'No website'}
              </a>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Clock size={16} className="text-gray-400" />
              <span>Last active: {new Date(lead.lastContacted).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden relative">
                    <div className="absolute top-0 left-0 bottom-0 bg-green-500" style={{width: `${lead.score}%`}}></div>
                </div>
                <span>Lead Score: {lead.score}/100</span>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl shadow-md text-white">
          <div className="flex items-center space-x-2 mb-4">
            <BrainCircuit className="text-purple-300" size={20} />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          
          {!analysis ? (
             <div className="text-center py-8 text-indigo-200 text-sm">
                <p>Click "AI Analyze & Draft" to parse the conversation history and get suggestions.</p>
             </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
                <div>
                    <span className="text-xs uppercase text-indigo-300 font-bold">Sentiment</span>
                    <div className="flex items-center mt-1">
                        <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                            analysis.sentiment === 'Positive' ? 'bg-green-500/20 text-green-200' :
                            analysis.sentiment === 'Negative' ? 'bg-red-500/20 text-red-200' :
                            'bg-yellow-500/20 text-yellow-200'
                        }`}>
                            {analysis.sentiment}
                        </span>
                    </div>
                </div>

                <div>
                    <span className="text-xs uppercase text-indigo-300 font-bold">Recommended Action</span>
                    <p className="text-sm font-medium mt-1">{analysis.suggestedAction}</p>
                </div>

                <div>
                    <span className="text-xs uppercase text-indigo-300 font-bold">Reasoning</span>
                    <p className="text-xs text-indigo-100 mt-1 leading-relaxed opacity-90">
                        {analysis.reasoning}
                    </p>
                </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
