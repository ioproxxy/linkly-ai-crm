import { AIAnalysisResult, Lead } from '../types';
import { apiClient } from './apiClient';

/**
 * Analyzes a lead via the backend AI module.
 * Secrets stay on the server; frontend only sends leadId.
 */
export const analyzeLeadWithGemini = async (lead: Lead): Promise<AIAnalysisResult> => {
  try {
    const result = await apiClient.post<AIAnalysisResult>('/ai/analyze-lead', { leadId: lead.id });
    return result;
  } catch (error) {
    console.error('AI analyzeLead error', error);
    return {
      sentiment: 'Neutral',
      suggestedAction: 'Manual Review',
      draftReply: `Hi ${lead.name},`,
      reasoning: 'Failed to analyze due to an error.',
    };
  }
};

/**
 * Chat with the Linkly AI Command Center (backend).
 * Returns the natural language response string.
 */
export const chatWithSalesAgent = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
): Promise<string> => {
  try {
    const payload = {
      message,
      history: history.map((h) => ({ role: h.role as 'user' | 'model', text: h.parts[0]?.text || '' })),
    };

    const result = await apiClient.post<{ response: string; decisions: unknown[] }>(
      '/ai/command',
      payload,
    );

    return result.response || 'No response received from AI.';
  } catch (e) {
    console.error('AI chat error', e);
    return "I'm having trouble connecting to the AI command center right now.";
  }
};
