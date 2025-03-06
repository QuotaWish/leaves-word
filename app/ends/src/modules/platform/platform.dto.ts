import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export enum CodeStatus {
  AVAILABLE = 0,
  SCANNED = 1,
  UNAVAILABLE,
  SUCCESS = 3,
  NEED_BIND = 4
}

export class PlatformLoginDto {
  @ApiProperty({ description: '登录平台', example: 'wechat' })
  @IsString()
  platform: string
}

export class DocDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({ description: '启用状态' })
  @IsBoolean()
  @IsOptional()
  status: boolean
}

export class DocQueryDto extends IntersectionType(PagerDto, DocDto) {}
