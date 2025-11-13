import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { PlansModule } from './plans/plans.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ChatModule,
    UserModule,
    PlansModule,
    WebsocketModule,
  ],
})
export class AppModule {}
