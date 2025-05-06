import { createAlova } from 'alova'
import utils from './utils'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import { createClientTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { useLeafEventBus } from '../event'
import { ToastEvent } from '../event/toast-event'
import { globalAuthStorage } from '~/modules/auth'
import { TryAuthLogoutEvent } from '../event/auth'

export const $api = {
  utils,
}

const eventBus = useLeafEventBus()

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication<typeof VueHook, typeof axiosRequestAdapter>({
  login: {
    handler: (response, method) => {
      const { code, data, message } = response.data

      if (code !== 0) {
        eventBus.fireEvent(new ToastEvent(message, 'error'))
        throw new Error(message)
      }

      const { token, user } = data

      globalAuthStorage.value.user = user
      globalAuthStorage.value.token = token

      globalAuthStorage.value.isLogin = true
    }
  },
  assignToken: method => {
    const token = globalAuthStorage.value.token
    if (!token)
      return

    method.config.headers[`${token.tokenName}`] = `${token.tokenValue}`
  },
  refreshToken: {
    isExpired: () => {
      const token = globalAuthStorage.value.token
      if (!token)
        return false

      const loginTime = globalAuthStorage.value.loginTime
      const target = loginTime + +token.tokenTimeout

      return target < Date.now() - 1000
    },
    handler: async () => {
      eventBus.fireEvent(new ToastEvent('登录过期，请重新登录', 'error'))
      eventBus.fireEvent(new TryAuthLogoutEvent())
    }
  }
})

/**
 * 11012	Token无效
11013	Token已过期
11014	Token已被顶下线
11015	Token已被踢下线
11016	Token已被冻结
 */

const alovaInstance = createAlova({
  baseURL: ENDS_URL,
  requestAdapter: axiosRequestAdapter({
    // axios: endHttp.$http
  }),
  beforeRequest: onAuthRequired(),
  responded: onResponseRefreshToken({
    onSuccess: (response, method) => {
      const { code, message } = response.data as unknown as any

      if (code === 11011) {
        eventBus.fireEvent(new TryAuthLogoutEvent())
        eventBus.fireEvent(new ToastEvent("登录已过期，请重新登录", 'error'))
        return
      }

      if (code === 11012) {
        eventBus.fireEvent(new TryAuthLogoutEvent())
        console.log('11012')
      }

      if (code === 11013) {
        eventBus.fireEvent(new TryAuthLogoutEvent())
        console.log('11013')
        return
      }

      if (code === 11014 || code === 11015 || code === 11016) {
        eventBus.fireEvent(new TryAuthLogoutEvent())
      }

      if (code !== 0) {
        eventBus.fireEvent(new ToastEvent(message, 'error'))
        throw new Error(message)
      }

      return response.data
    },
    onError: (error) => {
      console.log(error)
    },
  }),
  statesHook: VueHook
})

export const $endApi = alovaInstance

export function initApi() {
  console.log("%cLeafNet initialized 1.0.3", "color: red; font-size: 20px;")
}
