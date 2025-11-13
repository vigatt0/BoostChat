import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Inicialização do Firebase Admin
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT', '{}'),
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    this.firestore = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  // Método para salvar histórico de conversa
  async saveConversationHistory(userId: string, message: any) {
    try {
      await this.firestore
        .collection('conversations')
        .doc(userId)
        .collection('messages')
        .add({
          ...message,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      throw error;
    }
  }

  // Método para obter histórico de conversa
  async getConversationHistory(userId: string, limit: number = 10) {
    try {
      const snapshot = await this.firestore
        .collection('conversations')
        .doc(userId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      return [];
    }
  }

  // Método para obter dados do usuário
  async getUserData(userId: string) {
    try {
      const doc = await this.firestore.collection('users').doc(userId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      throw error;
    }
  }

  // Método para atualizar saldo de mensagens
  async updateMessageBalance(userId: string, count: number) {
    try {
      const userRef = this.firestore.collection('users').doc(userId);
      await userRef.update({
        messageBalance: admin.firestore.FieldValue.increment(-count),
        lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);
      throw error;
    }
  }
}
