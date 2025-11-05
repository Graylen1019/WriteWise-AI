import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleService } from './db/drizzle.service';
import { OpenAIController } from '../openai/openai.controller';
import { OpenAIService } from '../openai/openai.service';

@Module({
  imports: [],
  controllers: [AppController, OpenAIController],
  providers: [AppService, DrizzleService, OpenAIService],
})
export class AppModule {}
