import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Body, Controller, Get, Headers, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { Throttle } from '@nestjs/throttler'

import Redis from 'ioredis'
import {
  ApiConfigKit,
  MenuApi,
  WeChat,
} from 'tnwx'

import { create } from 'xmlbuilder2'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Bypass } from '~/common/decorators/bypass.decorator'
import { Ip } from '~/common/decorators/http.decorator'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { MenuManager } from '~/common/tnwx/menu-manager'
import { msgAdapterController } from '~/common/tnwx/msg-adapter'
import { ErrorEnum } from '~/constants/error-code.constant'

import { isLAN } from '~/utils/ip.util'

import { UserService } from '../user/user.service'

import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { type LoginDto, RegisterDto, SmsDto, SmsLoginDto } from './dto/auth.dto'
import { LocalGuard } from './guards/local.guard'
import { LoginToken } from './models/auth.model'
import { CaptchaService } from './services/captcha.service'

export const GlobalStatusOptions = {
  manualVersion: '21',
  version: process.env.VERSION,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}

@ApiTags('Auth - 认证模块')
@UseGuards(LocalGuard)
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private captchaService: CaptchaService,
    @InjectRedis() private redis: Redis,
  ) { }

  @Get('status')
  @ApiOperation({ summary: '服务器状态检测' })
  statusCheck() {
    return {
      message: 'OK',
      time: Date.now(),
      ...GlobalStatusOptions,
    }
  }

  @Get('wx_menu')
  @ApiOperation({ summary: '发送菜单请求给微信', description: '此接口用于本地测试使用，仅限本地ip访问下！，注意，仅限请求本接口时为本地ip。' })
  @ApiResult({ type: LoginToken })
  async sendWxMenu(@Ip() ip: string, @Headers('user-agent') ua: string): Promise<string> {
    if (!isLAN(ip))
      throw new BusinessException(ErrorEnum.SYSTEM_BUILTIN_FUNCTION_NOT_ALLOWED)

    const res = await MenuApi.create(JSON.stringify(MenuManager.getMenu()))

    console.log('1', JSON.stringify(MenuManager.getMenu()))

    return res
  }

  // 续签token
  @Get('renew_token')
  @ApiOperation({ summary: '续签token' })
  @ApiResult({ type: LoginToken })
  @Public()
  async renewToken(@Query('refresh_token') refresh_token: string): Promise<LoginToken> {
    if (!refresh_token)
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)

    const token = await this.authService.renewToken(refresh_token)

    console.log('refresh _ token', token)

    return token
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiResult({ type: LoginToken })
  async login(@Body() dto: LoginDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    await this.captchaService.checkImgCaptcha(dto.captchaId, dto.verifyCode)
    const token = await this.authService.login(
      dto.username,
      dto.password,
      ip,
      ua,
    )

    return token
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.userService.register(dto)
  }

  @Get('account_exist')
  @ApiOperation({ summary: '检查账号是否存在' })
  async accountExist(@Query('account') account: string,
  ) {
    const res = await this.userService.findUserByUserName(account)
    if (res) {
      return {
        username: res.username,
        nickname: res.nickname,
        avatar: res.avatar,
      }
    }
    return res
  }

  @Get('sms_code/miniprogram')
  @ApiOperation({ summary: '发送短信验证码（小程序）' })
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async sendSMSCodeThroughMiniProgram(@Query('phone') phone: string, @Ip() ip: string): Promise<any> {
    await this.authService.checkLimit(phone, ip)
    const [success, code] = await this.authService.sendSMSCode(phone)
    if (success === 'false' || !success) {
      console.log('sms-sent-err, code', code)
      throw new BusinessException('sms-sent-err')
    }

    await this.authService.log(phone, code, ip)
  }

  @Post('sms_code')
  @ApiOperation({ summary: '发送短信验证码' })
  @Throttle({ default: { limit: 5, ttl: 60 } })
  async sendSMSCode(@Body() dto: SmsDto, @Ip() ip: string): Promise<any> {
    // const [access, reason] = await AliCaptcha.validate(dto.param, 'wjwwx0wr') // Auth scene
    // if (access === 'false' || !access) {
    //   if (reason !== 'F004')
    //     throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
    // }

    await this.authService.checkLimit(dto.phone, ip)
    const [success, code] = await this.authService.sendSMSCode(dto.phone)
    if (success === 'false' || !success)
      throw new BusinessException('sms-sent-err')

    await this.authService.log(dto.phone, code, ip)
  }

  @Get('sms_login/miniprogram')
  @ApiOperation({ summary: '短信登录（小程序）' })
  @Throttle({ default: { limit: 15, ttl: 60 } })
  async smsLoginThroughMiniProgram(@Query('phone') phone: string, @Query('code') code: string, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    const token = await this.authService.smsLoginThroughMiniProgram(phone, code, ip, ua)

    return token
  }

  @Post('sms_login')
  @ApiOperation({ summary: '短信登录' })
  async smsLogin(@Body() dto: SmsLoginDto, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    // const [access, reason] = await AliCaptcha.validate(dto.param, 'wjwwx0wr') // Auth scene
    // if (access === 'false' || !access) {
    //   if (reason !== 'F004')
    //     throw new BusinessException(ErrorEnum.INVALID_VERIFICATION_CODE)
    // }

    const token = await this.authService.smsLogin(dto.phone, dto.code, ip, ua, dto.state)

    return token
  }

  @Get('platform_login')
  @ApiOperation({ summary: '三方平台登录' })
  async platformLogin(@Query('code') code: string, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    const token = await this.authService.wxLogin(code, ip, ua)

    return token
  }

  @Get('platform_login/feishu')
  @ApiOperation({ summary: '飞书平台登录' })
  async platformLoginFeishu(@Query('code') code: string, @Ip() ip: string, @Headers('user-agent') ua: string): Promise<LoginToken> {
    const token = await this.authService.feishuLogin(code, ip, ua)

    return token
  }

  @Bypass()
  @Get('wechat_verify')
  @ApiOperation({ summary: '微信验证' })
  async wechatVerify(@Query('signature') signature: string, @Query('timestamp') timestamp: string, @Query('nonce') nonce: string, @Query('echostr') echostr: string): Promise<string> {
    return WeChat.checkSignature(signature, timestamp, nonce, echostr)
  }

  @Bypass()
  @Post('wechat_verify')
  @ApiOperation({ summary: '微信推送' })
  async wechatPostMsg(@Req() req: Request, @Body() body: any): Promise<any> {
    const { xml } = body
    const _req = req as any

    const xmlBody = create({
      xml,
    }).end({ prettyPrint: true })

    const appId: string = _req.query.appId
    if (appId) {
      ApiConfigKit.setCurrentAppId(appId)
    }

    const { msgSignature, timestamp, nonce } = _req.query

    const result = await WeChat.handleMsg(msgAdapterController, xmlBody, msgSignature, timestamp, nonce)

    console.log('a', result)

    // const objResult = await Kits.xml2obj(result)
    // const xmlResult = await Kits.obj2xml(objResult)

    // console.log('[', xmlResult, ']', objResult)

    return result

    // console.log('a', result)

    // return `<?xml version="1.0" encoding="UTF-8"?>
    // ${result}`
  }
}
