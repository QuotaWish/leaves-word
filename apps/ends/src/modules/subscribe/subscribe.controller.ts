import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { Throttle } from '@nestjs/throttler'

import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { SubscriptionQueryDto } from './subscribe.dto'
import { SubscribeService } from './subscribe.service'

export const permissions = definePermission('subscribe', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Subscribe模块')
@UseGuards(ResourceGuard)
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) { }

  @Post('list')
  @Perm(permissions.LIST)
  @ApiOperation({ summary: '获取所有用户的订阅标签' })
  async list(@Body() dto: SubscriptionQueryDto) {
    return this.subscribeService.getAllUserSubscriptions(dto)
  }

  // 强制更新用户订阅
  @Get('update')
  @Perm(permissions.UPDATE)
  @ApiOperation({ summary: '强制更新用户订阅' })
  @Throttle({ default: { ttl: 60, limit: 10 } })
  async forceUpdateUserSubscribe(@Query('uid') uid: number) {
    return this.subscribeService.updateUserSubscription(uid)
  }
}
