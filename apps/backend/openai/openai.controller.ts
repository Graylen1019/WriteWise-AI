import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { OpenaiService, Suggestion } from './openai.service';
import type { Response } from 'express';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('suggest')
  async suggest(
    @Body() body: { text: string; tone?: string },
  ): Promise<{ suggestion: string }> {
    const { text, tone = 'neutral' } = body;

    if (!text?.trim()) {
      throw new HttpException('Missing text input', HttpStatus.BAD_REQUEST);
    }

    try {
      const suggestion = await this.openaiService.suggestRewrite(text, tone);
      return { suggestion };
    } catch (error) {
      console.error('❌ Error in /openai/suggest:', error);
      throw new HttpException(
        'Failed to get suggestion from OpenAI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze')
  async analyze(
    @Body() body: { text: string; tone?: string },
  ): Promise<{ suggestions: Suggestion[] }> {
    const { text, tone = 'neutral' } = body;

    if (!text?.trim()) {
      throw new HttpException('Missing text input', HttpStatus.BAD_REQUEST);
    }

    try {
      const suggestions = await this.openaiService.analyzeText(text, tone);
      return { suggestions };
    } catch (error) {
      console.error('❌ Error in /openai/analyze:', error);
      throw new HttpException(
        'Failed to analyze text with OpenAI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🧠 NEW: Streaming analyze endpoint for live typing feedback
   * Streams plain text analysis as the model generates it.
   */
  @Post('analyze-stream')
  async analyzeStream(
    @Body() body: { text: string; tone?: string },
    @Res() res: Response,
  ): Promise<void> {
    const { text, tone = 'neutral' } = body;

    if (!text?.trim()) {
      res.status(HttpStatus.BAD_REQUEST).send('Missing text input');
      return;
    }

    // Set up chunked response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    try {
      await this.openaiService.streamAnalyzeSummary(text, tone, (chunk) => {
        res.write(chunk);
      });
      res.end();
    } catch (error) {
      console.error('❌ Error in /openai/analyze-stream:', error);
      if (!res.headersSent) {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Failed to stream analysis');
      } else {
        res.end();
      }
    }
  }
}
