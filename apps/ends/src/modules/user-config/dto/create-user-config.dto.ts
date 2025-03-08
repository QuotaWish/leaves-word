import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateUserConfigDto {
  @ApiProperty({ description: '公开字段' })
  @IsString()
  pub_info: string

  @ApiProperty({ description: '私有字段' })
  @IsString()
  pri_info: string
}

export class UpdateUserConfigDto extends PartialType(CreateUserConfigDto) { }
