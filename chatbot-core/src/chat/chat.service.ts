import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LangchainService } from './langchain.service';
import { FirebaseService } from '../config/firebase.service';
import { RedisService } from '../config/redis.service';
import { SendMessageDto, ChatResponseDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private langchainService: LangchainService,
    private firebaseService: FirebaseService,
    private redisService: RedisService,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    const { userId, message, conversationId } = sendMessageDto;

    // Verifica dados do usuário e saldo de mensagens
    const userData = await this.firebaseService.getUserData(userId);
    if (!userData) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Verifica se o usuário tem mensagens disponíveis
    const messageBalance = userData.messageBalance || 0;
    const isUnlimited = userData.plan === 'unlimited' || userData.isUnlimited;

    if (!isUnlimited && messageBalance <= 0) {
      throw new ForbiddenException(
        'Você atingiu o limite de mensagens do seu plano. Faça upgrade para continuar! 💬',
      );
    }

    try {
      // Tenta obter histórico do cache
      let history = await this.redisService.getCacheConversation(userId);
      
      // Se não houver cache, busca do Firestore
      if (!history || history.length === 0) {
        history = await this.firebaseService.getConversationHistory(userId, 10);
        if (history.length > 0) {
          await this.langchainService.restoreConversationHistory(userId, history);
        }
      }

      // Processa a mensagem com IA
      const response = await this.langchainService.processMessage(userId, message);

      // Salva mensagem do usuário e resposta do bot
      await this.firebaseService.saveConversationHistory(userId, {
        role: 'user',
        content: message,
        conversationId: conversationId || userId,
      });

      await this.firebaseService.saveConversationHistory(userId, {
        role: 'assistant',
        content: response,
        conversationId: conversationId || userId,
      });

      // Atualiza cache de conversação
      const updatedHistory = [
        ...(history || []),
        { role: 'user', content: message },
        { role: 'assistant', content: response },
      ];
      await this.redisService.setCacheConversation(userId, updatedHistory);

      // Decrementa saldo de mensagens (somente se não for ilimitado)
      let remainingMessages = messageBalance;
      if (!isUnlimited) {
        await this.firebaseService.updateMessageBalance(userId, 1);
        remainingMessages = messageBalance - 1;
      } else {
        remainingMessages = -1; // -1 indica ilimitado
      }

      return {
        conversationId: conversationId || userId,
        response,
        timestamp: new Date(),
        remainingMessages,
      };
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      throw new BadRequestException('Erro ao processar sua mensagem. Tente novamente.');
    }
  }

  async clearConversation(userId: string): Promise<void> {
    // Limpa memória da IA
    this.langchainService.clearConversationMemory(userId);
    
    // Limpa cache
    await this.redisService.clearCache(`cache:conversation:${userId}`);
  }
}
