import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, Lead } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes a lead's interaction history to provide insights and a draft reply.
 */
export const analyzeLeadWithGemini = async (lead: Lead): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    console.warn("No API Key found");
    return {
      sentiment: 'Neutral',
      suggestedAction: 'Error: API Key missing',
      draftReply: '',
      reasoning: 'Please configure your Gemini API Key.'
    };
  }

  const model = 'gemini-2.5-flash';
  
  // Construct context
  const historyText = lead.history.map(m => `${m.sender}: ${m.content}`).join('\n');
  const prompt = `
    Analyze the following email thread with a prospect named ${lead.name} from ${lead.company}.
    Lead Website: ${lead.websiteUrl || 'N/A'}
    
    Conversation History:
    ${historyText}

    Determine the lead's sentiment, suggest the best next action (e.g., "Book Meeting", "Send Resources", "Archive"), 
    write a short reasoning for your decision, and draft a personalized response.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
            suggestedAction: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            draftReply: { type: Type.STRING }
          },
          required: ['sentiment', 'suggestedAction', 'reasoning', 'draftReply']
        } as Schema
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      sentiment: 'Neutral',
      suggestedAction: 'Manual Review',
      reasoning: 'Failed to analyze due to an error.',
      draftReply: 'Hi ' + lead.name + ','
    };
  }
};

/**
 * Chat with the Linkly AI Agent about global stats or specific campaigns.
 */
export const chatWithSalesAgent = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    if (!apiKey) return "API Key missing.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: `You are the AI Sales Operations Manager for Linkly. 
                You have access to campaign data (simulated).
                Current Stats:
                - Campaign "Q3 SaaS": 145 replies, 12 meetings.
                - Campaign "Enterprise": 28 replies, 5 meetings.
                
                Your goal is to help the admin understand performance and draft strategies. 
                Be concise, professional, and actionable. 
                If asked about specific leads, ask for the lead name.`
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error("Chat Error", e);
        return "I'm having trouble connecting to the sales database right now.";
    }
}
