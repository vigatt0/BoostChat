import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../config/firebase.service';
import { WebhookPlanDto } from './dto/webhook-plan.dto';

@Injectable()
export class PlansService {
  private readonly logger = new Logger(PlansService.name);

  constructor(private firebaseService: FirebaseService) {}

  async updateUserPlan(webhookData: WebhookPlanDto): Promise<any> {
    const { userId, plan, messageLimit, isUnlimited, stripeSubscriptionId, email } = webhookData;

    try {
      const firestore = this.firebaseService.getFirestore();
      const userRef = firestore.collection('users').doc(userId);

      // Verifica se o usuário existe
      const userDoc = await userRef.get();
      
      const updateData: any = {
        plan,
        messageBalance: messageLimit,
        messageLimit,
        isUnlimited: isUnlimited || plan === 'unlimited',
        updatedAt: new Date(),
      };

      if (stripeSubscriptionId) {
        updateData.stripeSubscriptionId = stripeSubscriptionId;
      }

      if (email) {
        updateData.email = email;
      }

      if (!userDoc.exists) {
        // Cria novo usuário
        await userRef.set({
          ...updateData,
          createdAt: new Date(),
          totalMessagesUsed: 0,
        });
        this.logger.log(`Novo usuário criado: ${userId} com plano ${plan}`);
      } else {
        // Atualiza usuário existente
        await userRef.update(updateData);
        this.logger.log(`Plano atualizado para usuário ${userId}: ${plan}`);
      }

      // Registra histórico de mudança de plano
      await firestore.collection('planHistory').add({
        userId,
        plan,
        messageLimit,
        isUnlimited,
        timestamp: new Date(),
        source: 'webhook',
      });

      return {
        success: true,
        message: 'Plano atualizado com sucesso! 🎉',
        data: updateData,
      };
    } catch (error) {
      this.logger.error('Erro ao atualizar plano:', error);
      throw error;
    }
  }

  async getPlanDetails(userId: string): Promise<any> {
    try {
      const userData = await this.firebaseService.getUserData(userId);
      
      if (!userData) {
        return null;
      }

      return {
        userId,
        plan: userData.plan,
        messageBalance: userData.messageBalance,
        messageLimit: userData.messageLimit,
        isUnlimited: userData.isUnlimited,
        stripeSubscriptionId: userData.stripeSubscriptionId,
      };
    } catch (error) {
      this.logger.error('Erro ao obter detalhes do plano:', error);
      throw error;
    }
  }
}
