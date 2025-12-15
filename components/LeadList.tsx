import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';
import { Search, Filter, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  isLoading?: boolean;
}

export const LeadList: React.FC<LeadListProps> = ({ leads, onSelectLead, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-gray-100 text-gray-700';
      case LeadStatus.CONTACTED: return 'bg-blue-100 text-blue-700';
      case LeadStatus.REPLIED: return 'bg-purple-100 text-purple-700';
      case LeadStatus.INTERESTED: return 'bg-orange-100 text-orange-700';
      case LeadStatus.MEETING_BOOKED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.values(LeadStatus).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Company</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Score</th>
              <th className="p-4 font-semibold">Last Contact</th>
              <th className="p-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading && filteredLeads.length === 0 && (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </td>
                  <td className="p-4">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </td>
                  <td className="p-4">
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                  </td>
                  <td className="p-4">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </td>
                  <td className="p-4">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </td>
                  <td className="p-4" />
                </tr>
              ))
            )}
            {filteredLeads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectLead(lead)}
              >
                <td className="p-4 font-medium text-gray-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div>{lead.name}</div>
                      <div className="text-gray-400 text-xs">{lead.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{lead.company}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                      <div 
                        className={`h-1.5 rounded-full ${lead.score > 70 ? 'bg-green-500' : lead.score > 40 ? 'bg-orange-400' : 'bg-red-400'}`} 
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{lead.score}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500 text-xs">
                  {new Date(lead.lastContacted).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-400">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}
            {!isLoading && filteredLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  No leads found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
