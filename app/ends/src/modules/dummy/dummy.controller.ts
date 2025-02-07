import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'
import { Public } from '../auth/decorators/public.decorator'

import { DummyService } from './dummy.service'

export const permissions = definePermission('dummy', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Dummy模块')
@UseGuards(ResourceGuard)
@Controller('dummy')
export class DummyController {
  constructor(private readonly dummyService: DummyService) { }

  @Public()
  @Get('list')
  async list() {
    return []
  }

  @Get('points')
  @ApiOperation({ summary: '获取用户积分' })
  async getUserPoints(@AuthUser() user: IAuthUser) {
    return await this.dummyService.getUserPoints(user.uid)
  }

  @ApiOperation({ summary: '获得用户抽奖次数' })
  @Get('lottery-count')
  async lotteryCount(@AuthUser() user: IAuthUser) {
    return this.dummyService.lotteryCount(user.uid)
  }

  @Get('lottery')
  @ApiOperation({ summary: '抽奖' })
  async lottery(@AuthUser() user: IAuthUser) {
    return this.dummyService.lottery(user.uid)
  }

  @Get('dummy')
  @ApiOperation({ summary: '获得抽奖幸运值' })
  async getLotteryLuckyDummy(@AuthUser() user: IAuthUser) {
    return this.dummyService.getLotteryDummy(user.uid)
  }

  @Get('fortune')
  @ApiOperation({ summary: '获得今日运势' })
  async getFortune(@AuthUser() user: IAuthUser) {
    return this.dummyService.getDailyFortune(user.uid)
  }

  @Get('signin')
  @ApiOperation({ summary: '每日签到' })
  async dailySignin(@AuthUser() user: IAuthUser) {
    const signinData = await this.dummyService.signToday(user)

    await this.dummyService.getSignReward(user)

    return signinData
  }

  @Get('signin/calendar')
  @ApiOperation({ summary: '签到日历' })
  async getSigninCalendar(@AuthUser() user: IAuthUser, @Query('year') year: number, @Query('month') month: number) {
    const date = new Date()

    const _year = year || date.getFullYear()
    const _month = month || date.getMonth() + 1

    return this.dummyService.getSignCalendar(user, _year, _month)
  }
}
