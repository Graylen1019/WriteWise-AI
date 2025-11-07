import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async suggestRewrite(text: string) {
    const prompt = `Rewrite this text to be more clear, engaging, and professional:\n\n${text}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 250,
    });

    return response.choices[0].message?.content?.trim() ?? 'No suggestion.';
  }
}
