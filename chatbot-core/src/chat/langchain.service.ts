import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class LangchainService {
  private model: ChatOpenAI;
  private conversationHistories: Map<string, Array<{ role: string; content: string }>>;

  constructor(private configService: ConfigService) {
    // Inicialização do modelo GPT
    this.model = new ChatOpenAI({
      modelName: this.configService.get<string>('OPENAI_MODEL', 'gpt-4'),
      temperature: 0.7,
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    this.conversationHistories = new Map();
  }

  // Template de sistema humanizado e empático
  private getSystemPrompt(): string {
    return `Você é um assistente virtual inteligente e empático chamado BoostChat.
    
Características:
- Você responde de forma amigável, natural e humanizada
- Demonstra empatia e compreensão genuína
- Usa emojis quando apropriado para criar conexão emocional
- Adapta seu tom de acordo com o contexto da conversa
- É prestativo, claro e objetivo nas respostas
- Nunca é robótico ou formal demais`;
  }

  // Obtém histórico de conversação para um usuário
  private getConversationHistory(userId: string): Array<{ role: string; content: string }> {
    if (!this.conversationHistories.has(userId)) {
      this.conversationHistories.set(userId, [
        { role: 'system', content: this.getSystemPrompt() },
      ]);
    }
    return this.conversationHistories.get(userId);
  }

  // Processa uma mensagem com contexto e memória
  async processMessage(userId: string, message: string): Promise<string> {
    try {
      // Obtém histórico do usuário
      const history = this.getConversationHistory(userId);

      // Adiciona mensagem do usuário
      history.push({ role: 'user', content: message });

      // Mantém apenas as últimas 20 mensagens para evitar excesso de tokens
      const recentHistory = history.slice(-20);

      // Processa com o modelo
      const response = await this.model.invoke(
        recentHistory.map((msg) => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
      );

      const assistantResponse = response.content.toString();

      // Adiciona resposta ao histórico
      history.push({ role: 'assistant', content: assistantResponse });

      // Atualiza histórico (mantém últimas 20 mensagens)
      this.conversationHistories.set(userId, history.slice(-20));

      return assistantResponse;
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      throw new Error('Erro ao processar mensagem com IA');
    }
  }

  // Limpa a memória de conversação de um usuário
  clearConversationMemory(userId: string) {
    this.conversationHistories.delete(userId);
  }

  // Restaura histórico de conversação
  async restoreConversationHistory(userId: string, history: any[]) {
    const systemPrompt = this.getSystemPrompt();
    const restoredHistory = [{ role: 'system', content: systemPrompt }];

    // Adiciona mensagens anteriores ao contexto
    for (const msg of history.slice(-10)) {
      // Mantém apenas últimas 10 do histórico
      if (msg.role === 'user' || msg.role === 'assistant') {
        restoredHistory.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    this.conversationHistories.set(userId, restoredHistory);
  }
}
