/**
 * AuthModule 是负责APP验证的入口
 * 此Module会在APP加载时进行初始化
 */
export interface AuthStorage {
  token: string
  refreshToken: string

  expires: number
  refreshExpires: number

  user: any
  role: any
  permission: any

  isLogin: boolean
  isRefresh: boolean
}

// export const useGlobaAuthState = createGlobalState(
//   () => {
//     const isLogin = ref(false)
//     return { isLogin }
//   },
// )

const emptyAuthStorage = { token: '', refreshToken: '', expires: 0, refreshExpires: 0, user: {}, role: {}, permission: {}, isLogin: false, isRefresh: false }

export const globalAuthStorage = useLocalStorage<AuthStorage>('leaf-auth', emptyAuthStorage)
