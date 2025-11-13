import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUsageDto } from './dto/user-usage.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId/usage')
  @HttpCode(HttpStatus.OK)
  async getUserUsage(@Param('userId') userId: string): Promise<UserUsageDto> {
    return this.userService.getUserUsage(userId);
  }
}
