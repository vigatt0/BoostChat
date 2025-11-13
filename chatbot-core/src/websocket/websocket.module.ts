import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from '../chat/chat.service';
import { LangchainService } from '../chat/langchain.service';
import { FirebaseService } from '../config/firebase.service';
import { RedisService } from '../config/redis.service';

@Module({
  providers: [ChatGateway, ChatService, LangchainService, FirebaseService, RedisService],
})
export class WebsocketModule {}
