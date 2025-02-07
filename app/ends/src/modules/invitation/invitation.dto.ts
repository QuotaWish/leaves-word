import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

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

export class DocUpdateDto extends PartialType(DocDto) {
  @ApiProperty({ description: '正文内容' })
  @IsString()
  value: string

  @ApiProperty({ description: '属性信息' })
  @IsString()
  meta: string

  @ApiProperty({ description: '权限信息' })
  @IsString()
  permission: string
}

export class DocQueryDto extends IntersectionType(PagerDto, DocDto) {}
