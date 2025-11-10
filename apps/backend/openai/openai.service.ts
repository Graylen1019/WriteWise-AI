import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

export interface Suggestion {
  id: string;
  type: 'grammar' | 'clarity' | 'tone' | 'improvement';
  title: string;
  description: string;
  original: string;
  suggested: string;
}

@Injectable()
export class OpenaiService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('Missing OPENAI_API_KEY');
    }

    this.client = new OpenAI({ apiKey });
  }

  /**
   * ✍️ Suggest a full rewrite of text with a given tone
   */
  async suggestRewrite(text: string, tone: string): Promise<string> {
    try {
      const prompt = `
      You are a professional writing assistant.
      Rewrite the following text to be more clear, concise, and ${tone} in tone.
      Return ONLY the rewritten text without explanations or formatting.

      Text: """${text}"""
      `;

      const response = await this.client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
        temperature: 0.7,
      });

      const output = response.output_text?.trim();
      if (!output) throw new Error('Empty response from OpenAI.');

      return output;
    } catch (error) {
      console.error('❌ Error in suggestRewrite:', error);
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to get rewrite suggestion',
      );
    }
  }

  /**
   * 🧠 Analyze text for AI-powered suggestions (JSON, non-streaming)
   */
  async analyzeText(text: string, tone: string): Promise<Suggestion[]> {
    try {
      const prompt = `
      You are an advanced AI writing assistant.
      Analyze the provided text for grammar, clarity, tone, and improvement opportunities.

      ✅ IMPORTANT:
      - Return a FLAT JSON ARRAY (not an object)
      - Each array item must represent one issue or suggestion
      - Each object must follow this schema exactly:

      [
        {
          "id": "1",
          "type": "grammar" | "clarity" | "tone" | "improvement",
          "title": "Short descriptive title",
          "description": "Explain what can be improved and why.",
          "original": "original text snippet",
          "suggested": "improved or rewritten version"
        }
      ]

      ❌ DO NOT return nested objects like {"grammar": {...}}.
      ❌ DO NOT include markdown code fences (e.g. \`\`\`json).

      Tone context: ${tone}
      Text to analyze:
      """${text}"""
      `;

      const response = await this.client.responses.create({
        model: 'gpt-4.1-mini',
        input: prompt,
        temperature: 0.6,
      });

      const output = response.output_text?.trim();
      if (!output) throw new Error('Empty response from OpenAI.');

      const cleaned = output.replace(/```json|```/g, '').trim();

      const parsed = this.safeJsonParse<Suggestion[]>(cleaned);
      if (!parsed || !Array.isArray(parsed)) {
        console.warn('⚠️ Expected JSON array but got invalid data:', cleaned);
        return [];
      }

      return parsed.map((p, i) => ({
        id: String(p.id || i + 1),
        type:
          p.type === 'grammar' ||
          p.type === 'clarity' ||
          p.type === 'tone' ||
          p.type === 'improvement'
            ? p.type
            : 'improvement',
        title: p.title ?? 'Suggestion',
        description: p.description ?? '',
        original: p.original ?? '',
        suggested: p.suggested ?? '',
      }));
    } catch (error) {
      console.error('❌ Error in analyzeText:', error);
      return [];
    }
  }

  /**
   * 🔒 Type-safe JSON parser helper
   */
  private safeJsonParse<T>(str: string): T | null {
    try {
      return JSON.parse(str) as T;
    } catch {
      return null;
    }
  }

  /**
   * 🧠 NEW: Streaming summary for live typing
   * Writes chunks of plain text analysis via the provided writer.
   */
  async streamAnalyzeSummary(
    text: string,
    tone: string,
    writer: (chunk: string) => void,
  ): Promise<void> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content:
          'You are a concise writing assistant. As you stream your response, provide short bullet-style comments on grammar, clarity, and tone issues. No JSON, no Markdown code fences. Just plain text.',
      },
      {
        role: 'user',
        content: `Tone: ${tone}\n\nText:\n"""${text}"""`,
      },
    ];

    const stream = await this.client.chat.completions.create({
      model: 'gpt-4.1-mini',
      stream: true,
      messages,
      temperature: 0.6,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        writer(delta);
      }
    }
  }
}
