import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import type { Relation } from 'typeorm'

import { PagerDto } from '~/common/dto/pager.dto'

import { FeedbackEntity } from '../entities/feedback.entity'

export enum FeedType {
  UI = 'UI',
  BUG = 'BUG',
  SUGGESTION = 'SUGGESTION',
  OTHER = 'OTHER',
}

export class CreateFeedbackDto {
  @ApiProperty({ description: '整体评价' })
  @IsNumber()
  allRate: number

  @ApiProperty({ description: '反馈类型' })
  @IsEnum(FeedType)
  feedType: FeedType

  @ApiProperty({ description: '反馈错误描述' })
  @IsString()
  feedDesc: string

  @IsOptional()
  @ApiProperty({ description: '反馈建议', required: false })
  @IsString()
  feedSuggestion: string
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
}

export class FeedbackQueryDto extends IntersectionType(PagerDto<Relation<FeedbackEntity>>, PartialType(FeedbackEntity)) {
  // @IsNumber()
  // @ApiProperty({ description: '用户ID' })
  // user_id: number
}
