export class UserUsageDto {
  userId: string;
  plan: string;
  messageBalance: number;
  totalMessagesUsed: number;
  isUnlimited: boolean;
  lastMessageAt: Date;
}
