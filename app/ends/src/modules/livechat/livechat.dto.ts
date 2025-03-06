import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

export class createLivechatDto {
  @ApiProperty({ description: '客服名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '客服二维码' })
  @IsString()
  qrcode: string

  @ApiProperty({ description: '客服手机号' })
  @IsNumber()
  phone: number
}

export class updateLivechatDto extends PartialType(createLivechatDto) {

}

export class queryLivechatDto extends IntersectionType(PagerDto<createLivechatDto>, PartialType(updateLivechatDto)) {

}
