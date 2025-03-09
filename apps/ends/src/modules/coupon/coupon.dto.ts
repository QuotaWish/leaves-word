import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class CreateCouponDto {
  @ApiProperty({ description: '优惠码前缀（必须是6位）', example: 'THISAI', default: 'THISAI' })
  @IsString()
  @IsOptional()
  @Length(6)
  prefix?: string

  @ApiProperty({ description: '优惠码数量，一次性最多不超过1000个', example: 10 })
  @IsInt()
  @IsPositive()
  quantity: number

  @ApiProperty({ description: '优惠金额（正数表示优惠金额[单位：分]，负数表示优惠百分比）', example: 500 })
  @IsInt()
  discountAmount: number

  @ApiProperty({ description: '有效期开始时间（没有表示通用）', example: '2023-10-01T00:00:00Z' })
  @IsString()
  @IsOptional()
  startDate?: string

  @ApiProperty({ description: '有效期结束时间（没有表示通用）', example: '2023-10-31T23:59:59Z' })
  @IsString()
  @IsOptional()
  endDate?: string

  // @ApiProperty({ description: '适用的产品ID列表', type: [Number], example: [1, 2, 3] })
  // @IsArray()
  // @IsOptional()
  // productIds?: number[]

  @ApiProperty({ description: '最大使用次数', example: 1 })
  @IsInt()
  @IsPositive()
  maxUsage: number

  // 指定用户可用 （单独做成分配接口）
  // @ApiProperty({ description: '指定用户可用', type: [Number], example: [1, 2, 3] })
  // @IsArray()
  // @IsOptional()
  // userIds?: number[]

  // minimumSpend
  @ApiProperty({ description: '最小消费金额（单位：分）', example: 500 })
  @IsInt()
  @IsPositive()
  minimumSpend: number

  // maximumSpend
  @ApiProperty({ description: '最大抵扣消费（正数表示消费金额[单位：分]，负数表示消费百分比）', example: 500 })
  @IsInt()
  @IsOptional()
  maximumDiscount: number

  // 是否可叠加使用
  @ApiProperty({ description: '是否可叠加使用，默认为false', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  stackable?: boolean

  // newUserOnly
  @ApiProperty({ description: '是否仅限新用户使用，默认为false', example: true, default: false })
  @IsBoolean()
  @IsOptional()
  newUserOnly?: boolean
}

export class CouponQueryDto extends IntersectionType(PagerDto<CreateCouponDto>, PartialType(CreateCouponDto)) {
}
