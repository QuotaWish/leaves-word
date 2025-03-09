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

import { MenuApi } from 'tnwx'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'
import { Public } from '../auth/decorators/public.decorator'

import { PlatformLoginDto } from './platform.dto'
import { PlatformService } from './platform.service'

export const permissions = definePermission('platform', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Platform模块')
@UseGuards(ResourceGuard)
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) { }

  @Public()
  @Post('qrcode')
  @ApiOperation({ summary: '申请平台登录' })
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async qrCodeLogin(@Body() dto: PlatformLoginDto): Promise<any> {
    const platform = dto.platform
    if (platform !== 'wechat')
      throw new BusinessException('None support this platform now.')

    return this.platformService.tryWechatPlatformLogin()
  }

  @Public()
  @Get('qrcode/status')
  @ApiOperation({ summary: '获取平台登录状态' })
  async getQrCodeStatus(@Query('platform') platform: string, @Query('key') key: string): Promise<any> {
    if (platform !== 'wechat')
      throw new BusinessException('None support this platform now.')

    return this.platformService.getCodeStatus(key)
  }

  @Public()
  @Get('qrcode/auth/wechat')
  @ApiOperation({ summary: '微信回调接口' })
  async tryQrCodeAuth(@Query('code') code: string, @Query('state') state: string): Promise<any> {
    return this.platformService.handleWechatAuthorize(code, state)
  }

  // 获得用户绑定的所有平台
  @Get('list')
  @ApiOperation({ summary: '获取用户绑定的平台列表' })
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async getPlatformList(@AuthUser() user: IAuthUser): Promise<any> {
    return this.platformService.getUserPlatformList(user)
  }

  @ApiOperation({ summary: '获取当前微信菜单' })
  @Get('wechat/menu')
  @Perm(permissions.READ)
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async getWechatMenu(): Promise<any> {
    return MenuApi.getCurrentSelfMenu()
  }
}
