declare global {
  interface IAuthUser {
    uid: number
    pv: number
    /** 过期时间 */
    exp?: number
    /** 签发时间 */
    iat?: number
    roles?: string[]

    subscription?: {
      id: number
      type: 'STANDARD' | 'ULTIMATE'
      orderId: string
      startDate: Date
      endDate: Date
      isActive: boolean
      autoRenew: boolean
      isTrial: boolean
    }
  }

  export interface IBaseResponse<T = any> {
    message: string
    code: number
    data?: T
  }

  export interface IListRespData<T = any> {
    items: T[]
  }
}

export {}
