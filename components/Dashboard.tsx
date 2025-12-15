import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { CHART_DATA, MOCK_CAMPAIGNS } from '../services/mockData';
import { Users, Send, MessageSquare, Calendar } from 'lucide-react';
import { ActivityPanel } from './ActivityPanel';

export const Dashboard: React.FC = () => {
  // Aggregate stats
  const totalSent = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.stats.sent, 0);
  const totalReplies = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.stats.replies, 0);
  const totalMeetings = MOCK_CAMPAIGNS.reduce((acc, c) => acc + c.stats.meetings, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Send size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Emails Sent</p>
            <p className="text-2xl font-bold text-gray-800">{totalSent.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Replies</p>
            <p className="text-2xl font-bold text-gray-800">{totalReplies.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Meetings Booked</p>
            <p className="text-2xl font-bold text-gray-800">{totalMeetings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Agents</p>
            <p className="text-2xl font-bold text-gray-800">8</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Engagement Activity (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} dot={false} name="Sent" />
                <Line type="monotone" dataKey="replies" stroke="#8b5cf6" strokeWidth={2} name="Replies" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Conversion Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Campaign Performance</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CAMPAIGNS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" stroke="#888" fontSize={10} tick={{width: 50}} />
                <YAxis stroke="#888" fontSize={12} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="stats.replies" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Replies" />
                <Bar dataKey="stats.meetings" fill="#10b981" radius={[4, 4, 0, 0]} name="Meetings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <ActivityPanel />
    </div>
  );
};
