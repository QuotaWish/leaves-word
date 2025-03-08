import type Redis from 'ioredis'
import {
  ApiConfig,
  ApiConfigKit,
  AxiosHttpKit,
  HttpKit,
} from 'tnwx'

import { env, isDev } from '~/global/env'

import eventProcessor from './event-processor'
import { msgAdapterController } from './msg-adapter'
import wechatPay from './pay/wechat-pay'
import { TokenCache } from './token-cache'

export const globalWxOptions = {
  APP_ID: env('WX_APP_ID'),
  APP_SECRET: env('WX_APP_SECRET'),
  TOKEN: env('WX_APP_TOKEN'),
  ENCODING_AES_KEY: env('WX_ENCRYPT_KEY'),
  REDIRECT_URL: env('WX_AUTH_REDIRECT_URL'),
  PAY_APP_ID: env('WX_PAY_APP_ID'),
  PAY_KEY: env('WX_PAY_APP_KEY'),
  PAY_MCHID: env('WX_PAY_MCHID'),
  PAY_NOTIFY_URL: env('WX_PAY_CALLBACK_URL'),
  PAY_CERTIFICATE_ID: env('WX_PAY_CERTIFICATE_ID'),

  MP_APP_ID: env('WX_MP_APP_ID'),
  MP_APP_SECRET: env('WX_MP_APP_SECRET'),
}

export const wxPublicConfig = new ApiConfig(globalWxOptions.APP_ID, globalWxOptions.APP_SECRET, globalWxOptions.TOKEN, false, globalWxOptions.ENCODING_AES_KEY)
export const wxMprogramConfig = new ApiConfig(globalWxOptions.MP_APP_ID, globalWxOptions.MP_APP_SECRET, globalWxOptions.TOKEN, false, globalWxOptions.ENCODING_AES_KEY)

ApiConfigKit.putApiConfig(wxPublicConfig)
ApiConfigKit.putApiConfig(wxMprogramConfig)

ApiConfigKit.devMode = isDev

ApiConfigKit.setCurrentAppId(wxPublicConfig.getAppId)

HttpKit.setHttpDelegate = new AxiosHttpKit()

export function injectCache(redis: Redis) {
  ApiConfigKit.setCache = new TokenCache(redis)

  msgAdapterController.initRedis(redis)
}

wechatPay()
eventProcessor()
