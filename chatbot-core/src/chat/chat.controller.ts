import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto, ChatResponseDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(sendMessageDto);
  }

  @Post('clear')
  @HttpCode(HttpStatus.OK)
  async clearConversation(@Body('userId') userId: string): Promise<{ message: string }> {
    await this.chatService.clearConversation(userId);
    return { message: 'Conversação limpa com sucesso! 🧹' };
  }
}
