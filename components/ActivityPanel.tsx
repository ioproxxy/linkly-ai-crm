import React, { useEffect, useState } from 'react';
import { fetchActivityEvents, fetchAiActions, ActivityEvent, AiActionEvent } from '../services/activityService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ActivityPanel: React.FC = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [aiEvents, setAiEvents] = useState<AiActionEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [e, ai] = await Promise.all([
          fetchActivityEvents(30),
          fetchAiActions(30),
        ]);
        setEvents(e);
        setAiEvents(ai);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto text-sm">
            {loading && events.length === 0 && <p className="text-gray-400">Loading activity…</p>}
            {!loading && events.length === 0 && (
              <p className="text-gray-400 text-sm">No activity yet. Trigger campaigns or lead updates.</p>
            )}
            {events.map((e) => (
              <div key={e.id} className="flex justify-between items-start border-b border-gray-50 pb-2">
                <div>
                  <p className="font-medium text-gray-800 text-xs">{e.action}</p>
                  <p className="text-[11px] text-gray-500 truncate max-w-xs">
                    {JSON.stringify(e.context || {})}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>AI Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto text-sm">
            {loading && aiEvents.length === 0 && <p className="text-gray-400">Loading AI history…</p>}
            {!loading && aiEvents.length === 0 && (
              <p className="text-gray-400 text-sm">No AI actions recorded yet.</p>
            )}
            {aiEvents.map((e) => (
              <div key={e.id} className="border-b border-gray-50 pb-2">
                <p className="font-medium text-gray-800 text-xs">{e.agent}</p>
                {e.error ? (
                  <p className="text-[11px] text-red-500 mt-0.5 truncate max-w-xs">Error: {e.error}</p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs">
                    {JSON.stringify(e.output || {})}
                  </p>
                )}
                <span className="text-[11px] text-gray-400">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
