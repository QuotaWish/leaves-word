import { UAParser } from 'ua-parser-js'

// 常见的浏览器
const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Opera', 'Edge']

export function useUaParser(userAgent: string) {
  const result = UAParser(userAgent)

  const { browser } = result

  const isBrowser = BROWSERS.includes(browser?.name || '')

  return {
    isBrowser,
    ...result,
  }
}

export function useDeviceUaParser() {
  return useUaParser(navigator.userAgent)
}
