import type { User } from '~/composables/api/clients/globals'
import { useLeafEventBus } from '~/composables/event'
import { AuthLogoutEvent, AuthSuccessEvent, ToastEvent, TryAuthLogoutEvent } from '~/composables/event/auth'

/**
 * AuthModule 是负责APP验证的入口
 * 此Module会在APP加载时进行初始化
 */
export interface AuthStorage {
  token?: {
    tokenName: string
    tokenValue: string
    isLogin: boolean
    loginId: string
    loginType: string
    tokenTimeout: string
    sessionTimeout: string
    tokenSessionTimeout: string
    tokenActiveTimeout: string
    loginDevice: string
    tag?: any
  }

  expires: number
  refreshExpires: number

  user: User
  role: any
  permission: any

  loginTime: number
  isLogin: boolean
  isRefresh: boolean
}

const eventBus = useLeafEventBus()
const emptyAuthStorage = { token: undefined, loginTime: 0, refreshToken: '', expires: 0, refreshExpires: 0, user: {}, role: {}, permission: {}, isLogin: false, isRefresh: false }

export const globalAuthStorage = useLocalStorage<AuthStorage>('leaf-auth', emptyAuthStorage)

watch(() => globalAuthStorage.value.isLogin, (val) => {
  if (val) {
    setTimeout(() => {
      const user = globalAuthStorage.value.user

      if (!user) {
        eventBus.fireEvent(new ToastEvent('认证失败，无用户数据！', 'error'))
        $logout()
        return
      }

      globalAuthStorage.value.loginTime = Date.now()

      eventBus.fireEvent(new AuthSuccessEvent(user.id || 0, user.userName || ''))
    }, 1000)
  }
}, { immediate: true })

eventBus.registerListener(TryAuthLogoutEvent, {
  handleEvent(event) {
    $logout()
  },
})

export function $logout() {
  globalAuthStorage.value = JSON.parse(JSON.stringify(emptyAuthStorage))

  eventBus.fireEvent(new AuthLogoutEvent())
}

export function initAuthModule() {
  console.log('%c 初始化认证模块 ', 'color: #000; background-color: #fff;')
}
