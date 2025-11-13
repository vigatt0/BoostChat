import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      this.userSockets.set(userId, client.id);
      this.logger.log(`Cliente conectado: ${client.id} (userId: ${userId})`);
      client.emit('connected', { message: 'Conectado ao chat em tempo real! 🚀' });
    } else {
      this.logger.warn(`Cliente sem userId: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`Cliente desconectado: ${client.id} (userId: ${userId})`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { userId: string; message: string; conversationId?: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.log(`Mensagem recebida de ${data.userId}: ${data.message}`);

      // Envia indicador de "digitando..."
      client.emit('typing', { isTyping: true });

      // Processa a mensagem
      const response = await this.chatService.sendMessage({
        userId: data.userId,
        message: data.message,
        conversationId: data.conversationId,
      });

      // Para de "digitando..."
      client.emit('typing', { isTyping: false });

      // Envia resposta ao cliente
      client.emit('messageReceived', {
        conversationId: response.conversationId,
        message: response.response,
        timestamp: response.timestamp,
        remainingMessages: response.remainingMessages,
      });

      this.logger.log(`Resposta enviada para ${data.userId}`);
    } catch (error) {
      this.logger.error('Erro ao processar mensagem:', error);
      client.emit('error', {
        message: error.message || 'Erro ao processar mensagem',
      });
    }
  }

  @SubscribeMessage('clearConversation')
  async handleClearConversation(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.chatService.clearConversation(data.userId);
      client.emit('conversationCleared', {
        message: 'Conversação limpa com sucesso! 🧹',
      });
    } catch (error) {
      this.logger.error('Erro ao limpar conversação:', error);
      client.emit('error', { message: 'Erro ao limpar conversação' });
    }
  }

  // Método para enviar notificações aos usuários
  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }
}
