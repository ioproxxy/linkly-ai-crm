import { apiClient } from './apiClient';
import { Lead } from '../types';

export async function fetchLeads(): Promise<Lead[]> {
  return apiClient.get<Lead[]>('/leads');
}

export async function fetchLead(id: string): Promise<Lead> {
  return apiClient.get<Lead>(`/leads/${id}`);
}
