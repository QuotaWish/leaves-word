import { EntityManager } from 'typeorm'

import { LoginType } from '~/modules/auth/dto/auth.dto'
import type { OrderEntity } from '~/modules/order/order.entity'
import { UserEntity } from '~/modules/user/user.entity'

export type IEventHandler = (...args: any[]) => void

export type EventName = 'USER_LOGIN_SUCCESS' | 'USER_PAY_SUCCESS' | 'USER_INVITATION_SUCCESS'

// 声明EventBus type
export interface IEventBus {
  on: {
    (eventName: 'USER_LOGIN_SUCCESS', callback: (user: UserEntity, loginType: LoginType, ip: string, address: string) => void): void
    (eventName: 'USER_PAY_SUCCESS', callback: (order: OrderEntity) => void): void
    (eventName: 'USER_INVITATION_SUCCESS', callback: (inviteUser: UserEntity, invitedUser: number, source: string) => void): void
    // (eventName: EventName, callback: (args: any) => void): void
  }

  // on: (eventName: EventName, callback: IEventHandler) => void
  // on(eventName: 'USER_LOGIN_SUCCESS', callback: (user: UserEntity) => void): void
  // on(eventName: EventName, callback: (user: UserEntity) => void): void
  // on(eventName: 'USER_PAY_SUCCESS', callback: (user: UserEntity, status: string) => void): void

  emit: {
    (eventName: 'USER_LOGIN_SUCCESS', user: UserEntity, loginType: LoginType, ip: string, address: string): void
    (eventName: 'USER_PAY_SUCCESS', order: OrderEntity): void
    (eventName: 'USER_INVITATION_SUCCESS', inviteUser: UserEntity, invitedUser: number, source: string): void
    // (eventName: EventName, ...args: any[]): void
  }
}

export class EventBus implements IEventBus {
  private eventMap: Map<EventName, IEventHandler[]> = new Map()

  entityManager: EntityManager

  injectBase(entityManager: EntityManager) {
    this.entityManager = entityManager
  }

  on: IEventBus['on'] = (eventName: EventName, callback: (...args: any[]) => void) => {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = []
    }

    this.eventMap[eventName]!.push(callback)
  }

  // on(eventName: EventName, callback: IEventHandler) {
  //   if (!this.eventMap.has(eventName)) {
  //     this.eventMap.set(eventName, [])
  //   }

  //   this.eventMap.get(eventName)?.push(callback)
  // }

  emit: IEventBus['emit'] = (eventName: EventName, ...args: any[]) => {
    const handlers = this.eventMap[eventName]

    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  }
}

export const $event = new EventBus()
