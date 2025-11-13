import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { LangchainService } from './langchain.service';
import { FirebaseService } from '../config/firebase.service';
import { RedisService } from '../config/redis.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, LangchainService, FirebaseService, RedisService],
  exports: [ChatService],
})
export class ChatModule {}
