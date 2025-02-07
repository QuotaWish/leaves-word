import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export enum DocStatus {
  DRAFT = 0, // 草稿
  UNPUBLISHED = 1, // 未发布
  PUBLISHED = 2, // 已发布
  ARCHIVED = 3, // 归档
  PROTOCOL = 4,
}

export class DocDto {
  @ApiProperty({ description: '文档标题' })
  @IsString()
  @MinLength(2)
  title: string

  // @ApiProperty({ description: '文档状态' })
  // status: DocStatus

  @ApiProperty({ description: '文档内容' })
  @IsString()
  @MaxLength(819200)
  content: string

  @ApiProperty({ description: '文档元数据' })
  @IsOptional()
  @IsString()
  meta: string

  @ApiProperty({ description: '文档权限' })
  @IsOptional()
  @IsString()
  permission: string
}

export class DocQueryDto extends IntersectionType(PagerDto<DocDto>, PartialType(DocDto)) {
}
