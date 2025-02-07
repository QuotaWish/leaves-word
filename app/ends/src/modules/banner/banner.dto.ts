import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { SubscribeType } from '../subscribe/subscribe.dto'

import { BannerMode } from './banner.entity'

export class CreateBannerGroupDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '其他属性' })
  @IsString()
  @IsOptional()
  property?: string

  @ApiProperty({ description: '用户订阅分组' })
  @IsEnum(SubscribeType)
  @IsOptional()
  user_subscribe?: SubscribeType[]

  @ApiProperty({ enum: BannerMode, description: '分组黑名单或白名单' })
  @IsEnum(BannerMode)
  @IsOptional()
  mode: BannerMode

  @ApiProperty({ description: '开始时间' })
  @IsDate()
  @IsOptional()
  startAt: Date

  @ApiProperty({ description: '结束时间' })
  @IsDate()
  @IsOptional()
  endAt: Date
}

export class UpdateBannerGroupDto extends PartialType(CreateBannerGroupDto) {
  @ApiProperty({ description: '横幅图片' })
  @IsArray()
  @IsOptional()
  posters: any[]
}

export class BannerGroupQueryDto extends IntersectionType(PagerDto<UpdateBannerGroupDto>, PartialType(UpdateBannerGroupDto)) {

}
