import { Body, Controller, Get, Param, Post } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'

import { CreateUserConfigDto } from './dto/create-user-config.dto'
import { UserConfigService } from './user-config.service'

@ApiTags('用户配置')
@Controller('user-config')
export class UserConfigController {
  constructor(private readonly userConfigService: UserConfigService) {}

  @ApiOperation({ summary: '上传用户配置' })
  @Post()
  post(@AuthUser() user: IAuthUser, @Body() createUserConfigDto: CreateUserConfigDto) {
    return this.userConfigService.updateConfig(user, createUserConfigDto)
  }

  @ApiOperation({ summary: '获取用户配置' })
  @Get('')
  getUserConfig(@AuthUser() user: IAuthUser) {
    return this.userConfigService.getByUser(user.uid)
  }

  // 获取某个用户的配置
  @ApiOperation({ summary: '获取某个用户的配置' })
  @Get('user/:uid')
  getUserConfigByUid(@AuthUser() user: IAuthUser, @Param('uid') uid: number) {
    return this.userConfigService.getByUserForPublic(uid)
  }
}
