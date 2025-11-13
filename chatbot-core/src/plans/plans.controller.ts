import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PlansService } from './plans.service';
import { WebhookPlanDto } from './dto/webhook-plan.dto';

@Controller('plans')
export class PlansController {
  private readonly logger = new Logger(PlansController.name);

  constructor(private readonly plansService: PlansService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhookUpdatePlan(@Body() webhookData: WebhookPlanDto): Promise<any> {
    this.logger.log('Webhook recebido para atualização de plano');
    return this.plansService.updateUserPlan(webhookData);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getPlanDetails(@Param('userId') userId: string): Promise<any> {
    return this.plansService.getPlanDetails(userId);
  }
}
