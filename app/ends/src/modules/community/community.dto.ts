import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export enum PostStatus {
  DRAFT = 0, // 草稿
  UNPUBLISHED = 1, // 未发布
  PUBLISHED = 2, // 已发布
  ARCHIVED = 3, // 归档
}

export enum PostPermission {
  PUBLIC,
  SUBSCRIBED,
  PRIVATE,
}

export class PostDto {
  @ApiProperty({ description: '帖子标题' })
  @IsString()
  @MinLength(2)
  title: string

  // @ApiProperty({ description: '文档状态' })
  // status: DocStatus

  @ApiProperty({ description: '帖子内容' })
  @IsString()
  @MaxLength(819200)
  content: string

  @ApiProperty({ description: '帖子元数据' })
  @IsOptional()
  @IsString()
  meta: string

  @ApiProperty({ description: '帖子权限' })
  @IsOptional()
  @IsString()
  permission: PostPermission
}

export class PostQueryDto extends IntersectionType(PagerDto<PostDto>, PartialType(PostDto)) {
}
