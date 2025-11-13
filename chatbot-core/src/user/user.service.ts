import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../config/firebase.service';
import { UserUsageDto } from './dto/user-usage.dto';

@Injectable()
export class UserService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserUsage(userId: string): Promise<UserUsageDto> {
    const userData = await this.firebaseService.getUserData(userId);

    if (!userData) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      userId,
      plan: userData.plan || 'free',
      messageBalance: userData.messageBalance || 0,
      totalMessagesUsed: userData.totalMessagesUsed || 0,
      isUnlimited: userData.plan === 'unlimited' || userData.isUnlimited || false,
      lastMessageAt: userData.lastMessageAt?.toDate() || null,
    };
  }
}
