import { apiClient } from './apiClient';

export interface ActivityEvent {
  id: string;
  action: string;
  context: Record<string, unknown> | null;
  createdAt: string;
}

export interface AiActionEvent {
  id: string;
  agent: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown> | null;
  error?: string | null;
  createdAt: string;
}

export async function fetchActivityEvents(limit = 50): Promise<ActivityEvent[]> {
  return apiClient.get<ActivityEvent[]>(`/activity/events?limit=${limit}`);
}

export async function fetchAiActions(limit = 50): Promise<AiActionEvent[]> {
  return apiClient.get<AiActionEvent[]>(`/activity/ai?limit=${limit}`);
}
