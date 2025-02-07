import { X509Certificate } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { PayKit, RequestMethod, WX_API_TYPE, WX_DOMAIN, WxPayApiConfig, WxPayApiConifgKit } from 'tnwx'
import WxPay from 'wechatpay-node-v3'

import { globalWxOptions } from '../init'

const relativePath = process.cwd()
const basePath = path.join(relativePath, 'certificate')

const p12Path = path.join(basePath, 'apiclient_cert.p12')
const pemPath = path.join(basePath, 'apiclient_cert.pem')
const keyPemPath = path.join(basePath, 'apiclient_key.pem')

export const keyBuffer = fs.readFileSync(keyPemPath)
export const pemBuffer = fs.readFileSync(pemPath)
export const x509 = new X509Certificate(fs.readFileSync(pemPath))

let $wxPay

export function getWxPay() {
  return $wxPay
}

export function genAuthorization(method: RequestMethod, urlSuffix: string, body: string) {
  return PayKit.buildAuthorization(
    method,
    urlSuffix,
    globalWxOptions.PAY_MCHID,
    x509.serialNumber,
    keyBuffer,
    body,
  )
}

export default () => {
  $wxPay = new WxPay({
    appid: globalWxOptions.PAY_APP_ID,
    mchid: globalWxOptions.PAY_MCHID,
    publicKey: pemBuffer,
    privateKey: keyBuffer,
    key: globalWxOptions.PAY_KEY,
  })

  const wxPayConfig = new WxPayApiConfig(
    globalWxOptions.APP_ID,
    globalWxOptions.PAY_KEY,
    globalWxOptions.PAY_KEY,
    'quotawish.com',
    globalWxOptions.PAY_MCHID,
    pemPath,
    p12Path,
    keyPemPath,
    'providerAppId',
    'provideMchId',
  )

  // 添加配置，支持多商户平台
  WxPayApiConifgKit.putConfig(wxPayConfig)
  // 设置当前应用
  WxPayApiConifgKit.setCurrentAppId(globalWxOptions.APP_ID)
  WxPayApiConifgKit.devMode = true
}

export interface WechatOrderCreateQuery {
  id: string
  description: string // display title
  attach: string
  total_fee: number
  expire_time: string

  others?: any
}

/**
 * 微信支付下单
 * 可能会抛出异常，必须处理异常
 * 全局订单失效时间，统一设置为5分钟
 * genRFCTime
 */
async function createOrder({ id, description, attach, total_fee, expire_time, others }: WechatOrderCreateQuery) {
  const data = {
    appid: globalWxOptions.PAY_APP_ID,
    mchid: globalWxOptions.PAY_MCHID,
    description,
    attach,
    out_trade_no: id,
    time_expire: expire_time,
    amount: {
      total: total_fee,
    },
    notify_url: globalWxOptions.PAY_NOTIFY_URL,
    ...(others || {}),
  }

  const { data: result } = await PayKit.v3(
    RequestMethod.POST,
    WX_DOMAIN.CHINA,
    WX_API_TYPE.NATIVE_PAY,
    globalWxOptions.PAY_MCHID,
    x509.serialNumber,
    keyBuffer,
    JSON.stringify(data),
  )

  console.log('[WechatPay] createOrder', JSON.stringify(result))

  return result
}

export const $wxApi = {
  createOrder,
}
