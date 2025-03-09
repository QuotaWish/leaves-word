import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'

import { getLogger } from '~/common/interceptors/logging.interceptor'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { checkCouponCode, genCouponCode } from '~/utils'

import { CouponQueryDto, CreateCouponDto } from './coupon.dto'
import { CouponUsageTransactionEntity, PaymentCouponEntity } from './coupon.entity'

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(PaymentCouponEntity)
    private couponRepository: Repository<PaymentCouponEntity>,
    @InjectRepository(CouponUsageTransactionEntity)
    private transactionRepository: Repository<CouponUsageTransactionEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  // 获取所有优惠码
  async getAllCoupons({ page, pageSize, startDate, endDate, stackable, newUserOnly }: CouponQueryDto): Promise<Pagination<PaymentCouponEntity>> {
    const queryBuilder = this.couponRepository
      .createQueryBuilder('payment_coupon')
      // .leftJoinAndSelect('payment_coupon.user', 'user')
      // .leftJoinAndSelect('payment_coupon.updater', 'updater')
      // .leftJoinAndSelect('payment_coupon.creator', 'creator')
      .where({
        ...(stackable ? { stackable } : null),
        ...(newUserOnly ? { newUserOnly } : null),
      })
      // .orWhere('payment_coupon.user IS NULL') // 未绑定用户的优惠码
      .orderBy('payment_coupon.updated_at', 'DESC')

    if (startDate)
      queryBuilder.andWhere('payment_coupon.startDate IS NULL OR payment_coupon.startDate <= :startDate', { startDate })

    if (endDate)
      queryBuilder.andWhere('payment_coupon.endDate IS NULL OR payment_coupon.endDate >= :endDate', { endDate })

    console.log('queryBuilder', queryBuilder.getQueryAndParameters())

    return paginate<PaymentCouponEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  // 获取某个用户的优惠码 一般来说用户的优惠券不会超过100个 直接返回即可
  // 不会有脑残管理员给某个用户100个优惠券的 发现直接毙了
  async getCoupons(user: IAuthUser) {
    return this.couponRepository.find({
      where: {
        user: {
          id: user.uid,
        },
      },
    })
  }

  // 核销优惠码
  async useCoupon(user: IAuthUser, orderId: string, code: string, totalFee: number) {
    const coupon = await this.checkCoupon(user, code, totalFee)

    // 使用优惠码
    this.entityManager.transaction(async (manager) => {
      coupon.usedCount += 1
      await manager.save(coupon)

      const transaction = manager.create(CouponUsageTransactionEntity, {
        user: {
          id: user.uid,
        },
        coupon: {
          code,
        },
        orderNumber: orderId,
      })

      await manager.save(transaction)
    })

    return coupon
  }

  // 检验某个优惠码
  async checkCoupon(user: IAuthUser, code: string, totalFee: number) {
    const coupon = await this.baseCheckCouponCode(user, code)

    // 查询之前是否有用过优惠码
    const transaction = await this.transactionRepository.findOne({
      where: {
        user: {
          id: user.uid,
        },
      },
    })

    if (transaction && coupon.newUserOnly) {
      throw new Error('优惠码仅限新用户使用')
    }

    // 消费最低金额
    if (totalFee < coupon.minimumSpend) {
      throw new Error('消费金额小于最低消费金额')
    }

    return coupon
  }

  // 批量创建优惠码
  async createCoupons(user: IAuthUser, body: CreateCouponDto) {
    return this.entityManager.transaction(async (manager) => {
      // generateUUID
      const { prefix, quantity, discountAmount, startDate, endDate, maxUsage, minimumSpend, maximumDiscount, stackable, newUserOnly } = body

      const coupons: PaymentCouponEntity[] = []

      for (let i = 0; i < quantity; i++) {
        const { code, mainCode } = genCouponCode(prefix || 'THISAI')

        const coupon = manager.create(PaymentCouponEntity, {
          code,
          mainCode,
          discountAmount,
          startDate,
          endDate,
          maxUsage,
          minimumSpend,
          maximumDiscount,
          stackable,
          newUserOnly,
          creator: {
            id: user.uid,
          },
          updater: {
            id: user.uid,
          },
        })

        coupons.push(coupon)
      }

      const result = await manager.save(coupons)

      getLogger().log(`[CouponCode] Generate ${result.length}/${quantity} success!`)

      return result
    })
  }

  // 分配某个券码给用户 一个券码只能给一个用户
  async assignCoupon(user: IAuthUser, uid: number, code: string) {
    const coupon = await this.baseCheckCouponCode(user, code)

    return this.entityManager.transaction(async manager => manager.update(PaymentCouponEntity, coupon, {
      user: {
        id: uid,
      },
      updater: {
        id: user.uid,
      },
    }))
  }

  async addUserCoupon(user: IAuthUser, code: string) {
    // 用户自行添加 则不更新updater
    const coupon = await this.baseCheckCouponCode(user, code)

    if (coupon.user) {
      throw new Error('优惠码已绑定用户')
    }

    await this.couponRepository.update(coupon.id, {
      user: {
        id: user.uid,
      },
    })
    // await this.entityManager.transaction(async manager => manager.update(PaymentCouponEntity, coupon, {
    //   user: {
    //     id: user.uid,
    //   },
    // }))

    return coupon
  }

  async invalidateCoupon(user: IAuthUser, code: string) {
    return this.entityManager.transaction(async manager => manager.update(PaymentCouponEntity, {
      code,
    }, {
      maxUsage: -1,
      updater: {
        id: user.uid,
      },
    }))
  }

  async baseCheckCouponCode(user: IAuthUser, code: string) {
    // 去数据库查找 code 或者 mainCOde字段等于code都可以
    const coupon = await this.couponRepository.findOne({
      where: [
        {
          code,
        },
        {
          mainCode: code,
        },
      ],
      relations: ['user', 'updater', 'creator'],
    })

    if (!coupon)
      throw new Error('优惠码不存在')

    // 先判断优惠码是否正确
    if (!checkCouponCode(coupon.code))
      throw new Error('优惠码不正确')

    if (coupon.usedCount >= coupon.maxUsage)
      throw new Error('优惠码已使用')

    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      throw new Error('优惠码已过期')
    }

    // 优惠券是不是还没开始
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
      throw new Error('优惠码还未生效')
    }

    // 判断优惠码是不是自己的
    if (coupon.user && coupon.user.id !== user.uid) {
      throw new Error('优惠码无法使用')
    }

    return coupon
  }
}
