import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('connect', () => {
      console.log('✅ Redis conectado com sucesso');
    });

    this.client.on('error', (error) => {
      console.error('❌ Erro no Redis:', error);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  // Método para armazenar sessão do usuário
  async setUserSession(userId: string, sessionData: any, ttl: number = 3600) {
    try {
      await this.client.setex(
        `session:${userId}`,
        ttl,
        JSON.stringify(sessionData),
      );
    } catch (error) {
      console.error('Erro ao definir sessão:', error);
      throw error;
    }
  }

  // Método para obter sessão do usuário
  async getUserSession(userId: string): Promise<any | null> {
    try {
      const data = await this.client.get(`session:${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao obter sessão:', error);
      return null;
    }
  }

  // Método para armazenar cache de conversação
  async setCacheConversation(userId: string, messages: any[], ttl: number = 1800) {
    try {
      await this.client.setex(
        `cache:conversation:${userId}`,
        ttl,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error('Erro ao definir cache:', error);
    }
  }

  // Método para obter cache de conversação
  async getCacheConversation(userId: string): Promise<any[] | null> {
    try {
      const data = await this.client.get(`cache:conversation:${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao obter cache:', error);
      return null;
    }
  }

  // Método para limpar cache
  async clearCache(pattern: string) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
}
