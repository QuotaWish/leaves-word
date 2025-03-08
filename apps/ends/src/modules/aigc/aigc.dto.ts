import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { QuotaModel } from './ai/types'
import { PromptEntity } from './aigc.entity'

export enum PromptStatus {
  // 等待审核
  WAIT = 0,
  // 审核通过（等待分类标签）
  PASS = 1,
  // 审核不通过
  REJECT = 2,
  // 已上线
  ONLINE = 3,
  // 已下线（已分类过标签）
  OFFLINE = 4,
}

export class ChatCompletionDto {
  @ApiProperty({ description: '对话ID' })
  @IsString()
  chat_id: string

  @ApiProperty({ description: '模型（默认为this-normal）' })
  @IsString()
  model: QuotaModel

  @ApiProperty({ description: '消息' })
  @IsArray()
  messages: IMessageItem[]

  @ApiProperty({ description: '消息序列' })
  @IsNumber()
  index: number

  @ApiProperty({ description: '温度（默认0.5）' })
  @IsNumber()
  temperature: number

  @ApiProperty({ description: '是否启用工具套装（默认为false）' })
  @IsBoolean()
  @IsOptional()
  tools: boolean

  // @ApiProperty({ description: '是否为生成标题（默认为false）' })
  // @IsBoolean()
  // @IsOptional()
  // generateTitle: boolean

  // @ApiProperty({ description: '是否为生成摘要（0代表不启用，1代表润色，2代表翻译，只有管理员模式下生效）' })
  // @IsNumber()
  // @IsOptional()
  // generateSummary: number

  @ApiProperty({ description: '使用PromptTemplate的id，仅限已审核通过的template' })
  @IsNumber()
  @IsOptional()
  templateId: number

  _template?: PromptEntity
}

export class AigcDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  value: string
}

export class ChatMessageDto {
  @ApiProperty({ description: '用户ID' })
  @IsNumber()
  @IsOptional()
  user_id?: number

  @ApiProperty({ description: '对话ID' })
  @IsString()
  @Matches(/^[\s\S]+$/)
  @MinLength(16)
  @MaxLength(128)
  chat_id: string

  @ApiProperty({ description: '对话主题' })
  @IsString()
  topic: string

  @ApiProperty({ description: '对话内容' })
  @IsString()
  value: string

  @ApiProperty({ description: '对话属性' })
  @IsString()
  meta: string
}

export class ChatMessageQueryDto extends IntersectionType(PagerDto<ChatMessageDto>, PartialType(ChatMessageDto)) {
  @IsOptional()
  user_id?: number

  @IsOptional()
  uid: string

  @IsOptional()
  topic: string
}

export class ChatLogDto {
  @IsOptional()
  message_type?: number

  @IsOptional()
  model?: string

  @IsOptional()
  status?: string
}

export class ChatLogQueryDto extends IntersectionType(PagerDto<ChatLogDto>, PartialType(ChatLogDto)) {
}

export class PromptDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(255)
  title: string

  @ApiProperty({ description: '描述' })
  @IsString()
  @MaxLength(255)
  description: string

  @ApiProperty({ description: '关键词' })
  @IsString()
  @MaxLength(255)
  keywords: string

  @ApiProperty({ description: '内容' })
  @IsString()
  @MaxLength(512)
  content: string

  @ApiProperty({ description: '头像' })
  @IsString()
  avatar: string
}

export class PromptQueryDto extends IntersectionType(PagerDto<PromptDto>, PartialType(PromptDto)) {
  // keyword
  @ApiProperty({ description: '搜索关键字' })
  @IsString()
  @IsOptional()
  keyword: string

  // status
  @ApiProperty({ description: '状态' })
  @IsNumber()
  @IsOptional()
  status: PromptStatus
}

export class PromptSearchDto extends PromptQueryDto {
  @ApiProperty({ description: '搜索关键字' })
  @IsString()
  declare keyword: string
}

export class PromptAuditDto {
  @ApiProperty({ description: '审核状态' })
  @IsNumber()
  status: PromptStatus

  @ApiProperty({ description: '审核意见' })
  @IsString()
  reason: string
}

export class PromptTagDto {
  @ApiProperty({ description: '标签名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '标签描述' })
  @IsString()
  description: string

  @ApiProperty({ description: '标签颜色', nullable: true })
  @IsString()
  color: string

  @ApiProperty({ description: '标签图标', nullable: true })
  @IsString()
  icon: string

  @ApiProperty({ description: '标签权重', nullable: true })
  @IsNumber()
  weight: number

  @ApiProperty({ description: '标签状态', nullable: true })
  @IsNumber()
  status: number

  // parentTagId
  @ApiProperty({ description: '父标签ID', nullable: true })
  @IsNumber()
  @IsOptional()
  parentTagId: number
}

export class PromptTagQueryDto extends IntersectionType(PagerDto<PromptDto>, PartialType(PromptDto)) {

}

export type IInnerItemType = 'markdown' | 'text' | 'tool' | 'card' | 'error' | 'file' | 'image'

export interface IInnerItemMeta {
  type: IInnerItemType
  name?: string
  data?: string
  value: string
  extra?: any
}

export interface IMessageItem {
  id: string
  page?: number
  role: 'user' | 'assistant' | 'system'
  content: IInnerItemMeta[]
}
