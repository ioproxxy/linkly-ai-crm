import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { AppLogger } from '../logging/logging.service';
import { AnalyzeLeadDto } from './dto/analyze-lead.dto';
import { ChatCommandDto } from './dto/chat-command.dto';
import { GoogleGenAI, Type, Schema } from '@google/genai';

@Injectable()
export class AiService {
  private readonly client: GoogleGenAI | null;

  constructor(private prisma: PrismaService, private logger: AppLogger) {
    const apiKey = process.env.GEMINI_API_KEY;
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured; AI features disabled', AiService.name);
    }
  }

  async analyzeLead(payload: AnalyzeLeadDto, userId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id: payload.leadId },
    });

    if (!lead) {
      throw new Error('Lead not found');
    }

    const aiAgent = 'lead_analyst_v1';

    if (!this.client) {
      await this.prisma.aiActionLog.create({
        data: {
          userId,
          leadId: lead.id,
          agent: aiAgent,
          input: { message: 'analyzeLead', leadId: payload.leadId },
          error: 'AI disabled: missing GEMINI_API_KEY',
        },
      });

      return {
        sentiment: 'Neutral',
        suggestedAction: 'Manual Review',
        draftReply: '',
        reasoning: 'AI is not configured on this environment.',
      };
    }

    const historyText = `${lead.name} at ${lead.company} (${lead.email})`;

    const prompt = `You are a deterministic sales analyst. Analyze the lead and return JSON only.`;

    const input = {
      leadId: lead.id,
      email: lead.email,
      name: lead.name,
      company: lead.company,
      websiteUrl: lead.websiteUrl,
      summary: historyText,
    };

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
        suggestedAction: { type: Type.STRING },
        reasoning: { type: Type.STRING },
        draftReply: { type: Type.STRING },
      },
      required: ['sentiment', 'suggestedAction', 'reasoning', 'draftReply'],
    };

    const log = await this.prisma.aiActionLog.create({
      data: {
        userId,
        leadId: lead.id,
        agent: aiAgent,
        input,
      },
    });

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: `${prompt}\n${JSON.stringify(input)}` }] }],
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const text = response.text || '{}';
      const json = JSON.parse(text);

      await this.prisma.aiActionLog.update({
        where: { id: log.id },
        data: { output: json },
      });

      return json;
    } catch (error: any) {
      this.logger.error('AI analyzeLead failed', error?.stack, AiService.name);
      await this.prisma.aiActionLog.update({
        where: { id: log.id },
        data: { error: String(error?.message || error) },
      });

      return {
        sentiment: 'Neutral',
        suggestedAction: 'Manual Review',
        draftReply: '',
        reasoning: 'AI call failed; please review manually.',
      };
    }
  }

  async chatCommand(payload: ChatCommandDto, userId: string) {
    const aiAgent = 'command_center_v1';

    if (!this.client) {
      await this.prisma.aiActionLog.create({
        data: {
          userId,
          agent: aiAgent,
          input: payload,
          error: 'AI disabled: missing GEMINI_API_KEY',
        },
      });

      return {
        response: "AI is not configured in this environment.",
        decisions: [],
      };
    }

    const log = await this.prisma.aiActionLog.create({
      data: {
        userId,
        agent: aiAgent,
        input: payload,
      },
    });

    const systemPrompt = `You are the AI command center for Linkly.
You MUST respond with JSON only.
You can propose high-level commands (like 'discover_leads', 'start_outreach', 'pause_campaign').
For destructive actions, include a 'requiresConfirmation' flag.
`;

    const historyParts = (payload.history || []).map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...historyParts,
          { role: 'user', parts: [{ text: payload.message }] },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              decisions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    command: { type: Type.STRING },
                    arguments: { type: Type.OBJECT },
                    requiresConfirmation: { type: Type.BOOLEAN },
                    rationale: { type: Type.STRING },
                  },
                  required: ['command', 'arguments', 'requiresConfirmation', 'rationale'],
                },
              },
            },
            required: ['response', 'decisions'],
          } as Schema,
        },
      });

      const text = response.text || '{}';
      const json = JSON.parse(text);

      await this.prisma.aiActionLog.update({
        where: { id: log.id },
        data: { output: json },
      });

      return json;
    } catch (error: any) {
      this.logger.error('AI chatCommand failed', error?.stack, AiService.name);
      await this.prisma.aiActionLog.update({
        where: { id: log.id },
        data: { error: String(error?.message || error) },
      });

      return {
        response: 'I could not process that command. Please try again.',
        decisions: [],
      };
    }
  }
}
