import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('suggest')
export class OpenAIController {
  constructor(private readonly openai: OpenAIService) {}

  @Post()
  async suggest(@Body('text') text: string) {
    if (!text) return { error: 'No text provided' };
    const suggestion = await this.openai.suggestRewrite(text);
    return { suggestion };
  }
}
