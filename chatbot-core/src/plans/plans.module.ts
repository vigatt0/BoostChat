import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { FirebaseService } from '../config/firebase.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, FirebaseService],
  exports: [PlansService],
})
export class PlansModule {}
