export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  REPLIED = 'Replied',
  INTERESTED = 'Interested',
  NOT_INTERESTED = 'Not Interested',
  MEETING_BOOKED = 'Meeting Booked'
}

export enum MessageSender {
  AI = 'AI',
  LEAD = 'Lead',
  USER = 'User'
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  campaignId: string;
  lastContacted: string;
  score: number; // 0-100 lead score
  history: Message[];
  websiteUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed';
  stats: {
    totalLeads: number;
    sent: number;
    replies: number;
    meetings: number;
  };
}

export interface AIAnalysisResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  suggestedAction: string;
  draftReply: string;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}