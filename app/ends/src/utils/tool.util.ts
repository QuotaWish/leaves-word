import { customAlphabet, nanoid } from 'nanoid'

import { md5 } from './crypto.util'

export function getAvatar(mail: string | undefined) {
  if (!mail)
    return ''

  return `https://cravatar.cn/avatar/${md5(mail)}?d=retro`
}

export function generateUUID(size: number = 21): string {
  return nanoid(size)
}

export function generateShortUUID(): string {
  return nanoid(10)
}

/**
 * 生成一个随机的值
 */
export function generateRandomValue(
  length: number,
  placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
): string {
  const customNanoid = customAlphabet(placeholder, length)
  return customNanoid()
}

/**
 * 生成一个随机的值
 */
export function randomValue(
  size = 16,
  dict = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict',
): string {
  let id = ''
  let i = size
  const len = dict.length
  while (i--) id += dict[(Math.random() * len) | 0]
  return id
}

export const hashString = function (str, seed = 0) {
  let h1 = 0xDEADBEEF ^ seed
  let h2 = 0x41C6CE57 ^ seed
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1
    = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
    ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2
    = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export const uniqueSlash = (path: string) => path.replace(/(https?:\/)|(\/)+/g, '$1$2')

function calculateBaseCode(str1: string, str2: string) {
  const sum1 = Array.from(str1).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const sum2 = Array.from(str2).reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const baseCode = Math.max(sum1, sum2) % Math.min(sum1, sum2)
  return baseCode
}

/**
 * 这是一个非常复杂的计算操作 请不要频繁调用 比如一秒钟一万次
 * 只需要给用户核验码以及随机码
 * 前缀码用于确定业务 请在核验的时候确定业务
 * 验证码请存在数据库中，每次核验的时候都去数据库中查找
 *
 * 卡号就是核验码 卡密就是随机码
 * 也可以都给用户
 */
export function genCouponCode(prefix: string = 'THISAI') {
  if (prefix.length !== 6)
    throw new Error('prefix must be 6 characters')

  // 32位码 = 6前缀码 + 16核验码 + 5随机码 + 5验证码
  const uniqueCode = generateUUID(16).replaceAll('-', '_')
  const randomCode = Date.now().toString(36).substring(2, 7)

  // 16进制取模
  const baseVerifyCode = calculateBaseCode(uniqueCode, randomCode) || 0

  // 将prefix取模randomCode
  const prefixVerifyCode = calculateBaseCode(prefix, randomCode) || 0

  // 将两个验证码拼起来 只取每个验证码的一位
  const verifyCode = `${String(baseVerifyCode)[0]}${String(prefixVerifyCode)[0]}`

  // 剩下3位验证码需要将整个字符串对 5330 取模 得到一个三位数（如果没有则在前面补Q 如果超出则截取最后三位）
  const code = `${prefix}-${uniqueCode}-${randomCode}-${verifyCode}`
  const endVerifyCode = calculateBaseCode(code, 'QUOTAWISH_THISAI_5330_COUPON_CODE')

  let endVerifyCodeText = String(endVerifyCode).padStart(3, 'Q')

  if (endVerifyCodeText.length > 3)
    endVerifyCodeText = endVerifyCodeText.substring(endVerifyCodeText.length - 3)

  return {
    code: `${code}${endVerifyCodeText}`,
    mainCode: `${uniqueCode}-${randomCode}`,
    verifyCode: `${verifyCode}${endVerifyCodeText}`,
    prefix,
  }
}

// 检验一个卡券码是否正确
export function checkCouponCode(couponCode: string) {
  const arr = couponCode.split('-')
  if (arr.length !== 4 || couponCode.length !== 35)
    return false

  const [prefix, uniqueCode, randomCode, verifyCode] = arr

  if (prefix.length !== 6 || uniqueCode.length !== 16 || randomCode.length !== 5 || verifyCode.length !== 5)
    return false

  // 倒着核验 先判断最后三位是否正确
  // 取出最后三位末尾验证码
  const endVerifyCodeText = verifyCode.substring(verifyCode.length - 3)
  // 获得两位验证码
  const endVerifyCode = verifyCode.substring(0, 2)

  // 拼凑当前字符串
  const code = `${prefix}-${uniqueCode}-${randomCode}-${endVerifyCode}`

  // 判断是否正确
  if (String(calculateBaseCode(code, 'QUOTAWISH_THISAI_5330_COUPON_CODE')).padStart(3, 'Q') !== endVerifyCodeText) {
    return false
  }

  // 核验 prefixVerifyCode
  if (String(calculateBaseCode(prefix, randomCode) || 0)[0] !== endVerifyCode[1]) {
    return false
  }

  if (String(calculateBaseCode(uniqueCode, randomCode) || 0)[0] !== endVerifyCode[0]) {
    return false
  }

  return true
}

export function withResolvers<T>(): {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
} {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve,
    reject,
  }
}

/**
 * 将文本加密，避免在MySQL中无法存储（语句出错）
 */
export function encodeText(text: string) {
  return btoa(encodeURIComponent(text))
}

/**
 * 将文本解密，避免在MySQL中无法存储（语句出错）
 */
export function decodeText(text: string) {
  return decodeURIComponent(atob(text))
}

export function encodeObject(obj: any) {
  return encodeText(JSON.stringify(obj))
}
