import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'userId é obrigatório' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'message é obrigatório' })
  message: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class ChatResponseDto {
  conversationId: string;
  response: string;
  timestamp: Date;
  remainingMessages: number;
}
