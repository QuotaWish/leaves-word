import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export enum SubscribeType {
  STANDARD = 'STANDARD', // 标准订阅计划
  ULTIMATE = 'ULTIMATE', // 旗舰订阅计划
}

export enum SubscribeTime {
  TRIAL = 'TRIAL', // 试用(1天)
  TRIAL_WEEK = 'TRIAL_WEEK', // 试用(7天)
  MONTH_TRIAL = 'MONTH_TRIAL', // 试用(30天)
  WEEK = 'WEEK', // 周订阅
  MONTH = 'MONTH', // 月订阅
  QUARTER = 'QUARTER', // 季度订阅
  YEAR = 'YEAR', // 年订阅
}

export class SubscriptionDto {
  @ApiProperty({ description: '订阅计划类型' })
  @IsOptional()
  @IsEnum(SubscribeType)
  type: SubscribeType

  @ApiProperty({ description: '相关订单号' })
  @IsOptional()
  @IsString()
  orderId: string

  @ApiProperty({ description: '订阅开始日期' })
  @IsOptional()
  @IsDate()
  startDate: Date

  @ApiProperty({ description: '订阅结束日期' })
  @IsOptional()
  @IsDate()
  endDate: Date

  @ApiProperty({ description: '订阅是否有效' })
  @IsBoolean()
  @IsOptional()
  isActive: boolean

  @ApiProperty({ description: '是否自动续费' })
  @IsBoolean()
  @IsOptional()
  isAutoRenew: boolean

  @ApiProperty({ description: '是否是试用订阅' })
  @IsBoolean()
  @IsOptional()
  isTrial: boolean

  @ApiProperty({ description: '用户id' })
  @IsOptional()
  @IsString()
  userId: string
}

export class DocUpdateDto extends PartialType(SubscriptionDto) {

}

export class SubscriptionQueryDto extends IntersectionType(PagerDto, SubscriptionDto) {}
