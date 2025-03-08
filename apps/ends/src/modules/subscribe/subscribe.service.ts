import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { EntityManager, MoreThan, Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'

import { SubscriptionQueryDto } from './subscribe.dto'
import { SubscriptionPlanEntity } from './subscribe.entity'

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(SubscriptionPlanEntity)
    private subscribeRepository: Repository<SubscriptionPlanEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRedis() private redis: Redis,
  ) { }

  // 获取用户订阅状态（指定订阅）
  async getUserSubscriptionStatus(user: IAuthUser, id: string) {
    return this.entityManager.findOne(SubscriptionPlanEntity, {
      where: {
        user: {
          id: user.uid,
        },
        orderId: id,
      },
    })
  }

  // 获取用户订阅状态(最新有效订阅)
  async getUserSubscription(uid: number) {
    let result: any = await this.redis.get(`user:${uid}:subscription`)
    if (!result) {
      result = await this.entityManager.findOne(SubscriptionPlanEntity, {
        where: {
          user: {
            id: uid,
          },
          isActive: true,
          endDate: MoreThan(new Date()), // 大于当前时间
        },
      })

      await this.redis.set(`user:${uid}:subscription`, JSON.stringify(result), 'EX', 60 * 30) // 30min
    }
    else {
      result = JSON.parse(result)
    }

    return result as SubscriptionPlanEntity
  }

  // 获取用户所有订阅（原则上同一时刻只能有一个订阅）
  async getUserSubscriptions(user: IAuthUser) {
    const result = await this.entityManager.find(SubscriptionPlanEntity, {
      where: {
        user: {
          id: user.uid,
        },
      },
    })

    return result
  }

  // 获取所有用户的订阅信息
  async getAllUserSubscriptions({ page, pageSize }: SubscriptionQueryDto) {
    const queryBuilder = this.entityManager.createQueryBuilder(SubscriptionPlanEntity, 'subscription_plan')
      .leftJoinAndSelect('subscription_plan.user', 'user')
      .leftJoinAndSelect('subscription_plan', 'orders', 'orders.id = subscription_plan.orderId')
      .orderBy('subscription_plan.updatedAt', 'DESC')

    return paginate<SubscriptionPlanEntity>(queryBuilder, { page, pageSize })
  }

  // 强制更新用户订阅
  async updateUserSubscription(uid: number) {
    await this.redis.del(`user:${uid}:subscription`)

    return this.getUserSubscription(uid)
  }
}
