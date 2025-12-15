import { Lead, LeadStatus, Campaign, MessageSender } from '../types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'Q3 SaaS Outreach',
    status: 'Active',
    stats: { totalLeads: 1200, sent: 850, replies: 145, meetings: 12 }
  },
  {
    id: 'c2',
    name: 'Enterprise Partnerships',
    status: 'Active',
    stats: { totalLeads: 400, sent: 320, replies: 28, meetings: 5 }
  },
  {
    id: 'c3',
    name: 'Webinar Follow-up',
    status: 'Paused',
    stats: { totalLeads: 500, sent: 500, replies: 200, meetings: 45 }
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.com',
    company: 'TechCorp',
    status: LeadStatus.INTERESTED,
    campaignId: 'c1',
    lastContacted: '2023-10-24T10:00:00Z',
    score: 85,
    websiteUrl: 'https://techcorp.com',
    history: [
      { id: 'm1', sender: MessageSender.AI, content: 'Hi Sarah, noticed TechCorp is expanding. Have you considered AI for your sales ops?', timestamp: '2023-10-20T09:00:00Z' },
      { id: 'm2', sender: MessageSender.LEAD, content: 'Actually yes, we are looking into tools right now. Can you send pricing?', timestamp: '2023-10-21T14:30:00Z' },
      { id: 'm3', sender: MessageSender.AI, content: 'Our pricing is flexible based on seats. Would you like a quick demo call?', timestamp: '2023-10-21T14:35:00Z' }
    ]
  },
  {
    id: 'l2',
    name: 'David Ross',
    email: 'david@greenenergy.io',
    company: 'GreenEnergy',
    status: LeadStatus.REPLIED,
    campaignId: 'c1',
    lastContacted: '2023-10-25T11:20:00Z',
    score: 60,
    websiteUrl: 'https://greenenergy.io',
    history: [
      { id: 'm4', sender: MessageSender.AI, content: 'Hi David, saw your recent funding news. Congrats!', timestamp: '2023-10-23T09:00:00Z' },
      { id: 'm5', sender: MessageSender.LEAD, content: 'Thanks! Not interested in sales tools right now though.', timestamp: '2023-10-23T11:00:00Z' }
    ]
  },
  {
    id: 'l3',
    name: 'Elena Fisher',
    email: 'efisher@designstudio.net',
    company: 'DesignStudio',
    status: LeadStatus.MEETING_BOOKED,
    campaignId: 'c3',
    lastContacted: '2023-10-26T09:00:00Z',
    score: 95,
    websiteUrl: 'https://designstudio.net',
    history: [
      { id: 'm6', sender: MessageSender.AI, content: 'Loved the webinar attendance. Want to discuss implementation?', timestamp: '2023-10-25T10:00:00Z' },
      { id: 'm7', sender: MessageSender.LEAD, content: 'Yes, let\'s book time for Tuesday.', timestamp: '2023-10-25T15:00:00Z' }
    ]
  },
  {
    id: 'l4',
    name: 'Marcus Chen',
    email: 'marcus@fintech.co',
    company: 'FinTech Co',
    status: LeadStatus.CONTACTED,
    campaignId: 'c2',
    lastContacted: '2023-10-27T08:00:00Z',
    score: 40,
    websiteUrl: 'https://fintech.co',
    history: [
      { id: 'm8', sender: MessageSender.AI, content: 'Helping fintechs scale support. Open to a chat?', timestamp: '2023-10-27T08:00:00Z' }
    ]
  },
  {
    id: 'l5',
    name: 'Priya Patel',
    email: 'priya@logisticssolutions.com',
    company: 'Logistics Solutions',
    status: LeadStatus.NEW,
    campaignId: 'c1',
    lastContacted: '2023-10-27T12:00:00Z',
    score: 20,
    history: []
  }
];

// Helper to simulate chart data
export const CHART_DATA = [
  { name: 'Mon', sent: 400, replies: 24, meetings: 2 },
  { name: 'Tue', sent: 300, replies: 13, meetings: 1 },
  { name: 'Wed', sent: 550, replies: 45, meetings: 5 },
  { name: 'Thu', sent: 480, replies: 38, meetings: 3 },
  { name: 'Fri', sent: 200, replies: 10, meetings: 1 },
  { name: 'Sat', sent: 50, replies: 5, meetings: 0 },
  { name: 'Sun', sent: 80, replies: 8, meetings: 0 },
];
