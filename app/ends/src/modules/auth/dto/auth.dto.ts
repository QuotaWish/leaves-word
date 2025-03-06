import { ApiProperty } from '@nestjs/swagger'

import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SmsDto {
  @ApiProperty({ description: '手机号' })
  @IsString()
  @MinLength(11)
  phone: string

  @ApiProperty({ description: 'Captcha Param', example: 'json' })
  @IsString()
  param: string
}

export class SmsLoginDto {
  @ApiProperty({ description: '手机号' })
  @IsString()
  @MinLength(11)
  phone: string

  @ApiProperty({ description: '手机验证码' })
  @IsString()
  @MinLength(6)
  code: string

  @ApiProperty({ description: 'Captcha Param', example: 'json' })
  @IsString()
  param: string

  @ApiProperty({ description: 'Binding State' })
  @IsString()
  @IsOptional()
  state: string
}

export class LoginDto {
  @ApiProperty({ description: '手机号/邮箱' })
  @IsString()
  @MinLength(4)
  username: string

  @ApiProperty({ description: '密码', example: 'a123456' })
  @IsString()
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i)
  @MinLength(6)
  password: string

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string

  @ApiProperty({ description: '用户输入的验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string
}

export class RegisterDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  username: string

  @ApiProperty({ description: '密码' })
  @IsString()
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i)
  @MinLength(6)
  @MaxLength(16)
  password: string

  @ApiProperty({ description: '语言', examples: ['EN', 'ZH'] })
  @IsString()
  lang: string
}

export enum LoginType {
  // Account & Password
  WEB_AP = 'WEB_AP',
  WEB_PHONE = 'WEB_PHONE',
  WEB_WECHAT = 'WEB_WECHAT',
  PC_FEISHU = 'PC_FEISHU',
  WX_MINI_PROGRAM = 'WECHAT_MINI_PROGRAM',
}
