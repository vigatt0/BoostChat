import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class WebhookPlanDto {
  @IsString()
  @IsNotEmpty({ message: 'userId é obrigatório' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'plan é obrigatório' })
  plan: string; // 'basic', 'pro', 'unlimited'

  @IsNumber()
  @IsNotEmpty({ message: 'messageLimit é obrigatório' })
  messageLimit: number;

  @IsBoolean()
  @IsOptional()
  isUnlimited?: boolean;

  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string;

  @IsString()
  @IsOptional()
  email?: string;
}
