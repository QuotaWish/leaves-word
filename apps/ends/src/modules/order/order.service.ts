import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { CronExpression } from '@nestjs/schedule'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import { Kits } from 'tnwx'
import { Between, EntityManager, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm'

import { CronOnce } from '~/common/decorators/cron-once.decorator'
import { $event } from '~/common/eventbus/init'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { getLogger } from '~/common/interceptors/logging.interceptor'
import { getSubscription } from '~/common/subscription'
import { $wxApi } from '~/common/tnwx/pay/wechat-pay'

import { paginate } from '~/helper/paginate'
import { encodeObject, genRFCTime } from '~/utils'

import { CouponService } from '../coupon/coupon.service'
import { PointsSummaryEntity, PointsTransactionEntity } from '../dummy/dummy.entity'
import { SubscribeTime, SubscribeType } from '../subscribe/subscribe.dto'
import { SubscriptionPlanEntity } from '../subscribe/subscribe.entity'
import { UserEntity } from '../user/user.entity'

import { DummyOrderDto, OrderQueryDto, OrderStatus, PaymentMethod, SubscribeOrderDto, WechatTradeState } from './order.dto'
import { OrderEntity, OrderItemEntity } from './order.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(SubscriptionPlanEntity)
    private subscriptionRepository: Repository<SubscriptionPlanEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRedis() private redis: Redis,
    private readonly couponService: CouponService,
  ) {
  }

  // 返回单位为分
  async getFee(user: IAuthUser, isTrial: boolean, type: SubscribeType, time: SubscribeTime, couponCode: string) {
    const plan = getSubscription(time, type)
    if (!plan)
      throw new BusinessException(`当前没有可用的订阅(${type},${time})`)

    if (isTrial) {
      // 如果试用类型是高级类型 返回异常即可
      if (type === SubscribeType.ULTIMATE)
        throw new BusinessException('当前没有可用的试用订阅')

      // 首先判断有无订阅记录（只要有任意试用订阅 都不能再订阅）
      const result = await this.entityManager.findOne(
        SubscriptionPlanEntity,
        {
          where: {
            user: {
              id: user.uid,
            },
            isTrial: true,
          },
        },
      )
      if (result)
        throw new BusinessException('当前没有可用的试用订阅')
    }

    plan.info = plan.info.map(item => ({
      ...item,
      price: item.price.replace('%total%', `${plan.meta.fee}`),
    }))

    getLogger().log(`[Order] Get subscription price: ${plan.meta.fee}`)

    // @ts-expect-error return value ignored
    plan.meta.tax = Math.round(plan.meta.fee * 0.02, 0)
    // @ts-expect-error return value ignored
    plan.meta.feeTax = Math.round(plan.meta.fee + plan.meta.tax, 0)

    // @ts-expect-error return value ignored
    getLogger().log(`[Order] [Fee] OriginPrice: ${plan.meta.fee}, Tax: ${plan.meta.tax}, FeeTax: ${plan.meta.feeTax}`)

    const priceObj: typeof plan = JSON.parse(JSON.stringify(plan))

    if (couponCode) {
      getLogger().log(`[Order] Use coupon: ${couponCode} | PriceMeta: ${JSON.stringify(priceObj.meta)}`)
      const totalFee = priceObj.meta.fee
      const { discountAmount, maximumDiscount, minimumSpend } = await this.couponService.checkCoupon(user, couponCode, totalFee)
      const curPrice = priceObj.meta.fee

      // 计算最大抵扣
      const maxDiscount = maximumDiscount ? (maximumDiscount > 0 ? maximumDiscount : curPrice * -maximumDiscount) : null
      console.log('---', { maxDiscount, curPrice, discountAmount, maximumDiscount, minimumSpend })

      if (discountAmount > 0) {
        // 直接抵扣金额
        priceObj.meta.fee = maxDiscount ? Math.min(curPrice - discountAmount, maxDiscount) : curPrice - discountAmount
      }
      else {
        // 抵扣百分比
        priceObj.meta.fee = maxDiscount ? Math.min(curPrice * (1 + discountAmount), maxDiscount) : curPrice * (1 + discountAmount)
      }

      // 最低
      priceObj.meta.fee = Math.max(minimumSpend || 0, priceObj.meta.fee)
      if (priceObj.meta.fee <= 0)
        priceObj.meta.fee = 1

      // 重新计算税费
      // @ts-expect-error return value ignored
      priceObj.meta.tax = Math.round(priceObj.meta.fee * 0.02, 0)
      // @ts-expect-error return value ignored
      priceObj.meta.feeTax = Math.round(priceObj.meta.fee + priceObj.meta.tax, 0)

      getLogger().log(`[Order] Use coupon: ${couponCode}`, {
        totalFee,
        discountAmount,
        maximumDiscount,
        curPrice,
        maxDiscount,
        priceObj,
      })

      // await this.couponService.useCoupon(user, couponCode, totalFee)
    }

    return priceObj
  }

  // 返回单位为分
  async getDummyFee(user: IAuthUser, value: number, couponCode: string) {
    const dummyObj = {
      name: '账户钱包充值',
      type: 'BALANCE',
      meta: {
        tax: 0,
        fee: value,
        originPrice: value * 1.2,
        unit: 'CNY',
      },
      info: [
        {
          name: `科塔智爱账户钱包积分x${value}`,
          price: value,
        },
        {
          name: '专属在线客服',
          free: true,
          price: '0',
        },
      ],
    }

    getLogger().log(`[Order] Get dummy price: ${dummyObj.meta.fee}`)

    // @ts-expect-error return value ignored
    dummyObj.meta.feeTax = Math.round(dummyObj.meta.fee + dummyObj.meta.tax, 0)

    // @ts-expect-error return value ignored
    getLogger().log(`[Order] [Fee] OriginPrice: ${dummyObj.meta.fee}, Tax: ${dummyObj.meta.tax}, FeeTax: ${dummyObj.meta.feeTax}`)

    const priceObj: typeof dummyObj = JSON.parse(JSON.stringify(dummyObj))

    if (couponCode) {
      getLogger().log(`[Order] Use coupon: ${couponCode} | PriceMeta: ${JSON.stringify(priceObj.meta)}`)
      const totalFee = priceObj.meta.fee
      const { discountAmount, maximumDiscount, minimumSpend } = await this.couponService.checkCoupon(user, couponCode, totalFee)
      const curPrice = priceObj.meta.fee

      // 计算最大抵扣
      const maxDiscount = maximumDiscount ? (maximumDiscount > 0 ? maximumDiscount : curPrice * -maximumDiscount) : null
      console.log('---', { maxDiscount, curPrice, discountAmount, maximumDiscount, minimumSpend })

      if (discountAmount > 0) {
        // 直接抵扣金额
        priceObj.meta.fee = maxDiscount ? Math.min(curPrice - discountAmount, maxDiscount) : curPrice - discountAmount
      }
      else {
        // 抵扣百分比
        priceObj.meta.fee = maxDiscount ? Math.min(curPrice * (1 + discountAmount), maxDiscount) : curPrice * (1 + discountAmount)
      }

      // 最低
      priceObj.meta.fee = Math.max(minimumSpend || 0, priceObj.meta.fee)
      if (priceObj.meta.fee <= 0)
        priceObj.meta.fee = 1

      // 重新计算税费
      // @ts-expect-error return value ignored
      priceObj.meta.tax = Math.round(priceObj.meta.fee * 0.02, 0)
      // @ts-expect-error return value ignored
      priceObj.meta.feeTax = Math.round(priceObj.meta.fee + priceObj.meta.tax, 0)

      getLogger().log(`[Order] Use coupon: ${couponCode}`, {
        totalFee,
        discountAmount,
        maximumDiscount,
        curPrice,
        maxDiscount,
        priceObj,
      })

      // await this.couponService.useCoupon(user, couponCode, totalFee)
    }

    return priceObj
  }

  async subscribeOrder(user: IAuthUser, subscribeDto: SubscribeOrderDto) {
    const { type, time, couponCode, payMethod } = subscribeDto

    return this.entityManager.transaction(async (manager) => {
      // 首先要判断订阅是否存在，任意有效期内的订阅存在都不能继续订阅 续费也不行（暂时不支持）
      // 1. 有效期判断：isActive = true 并且 endDate > now
      const userPlan = await manager.findOne(SubscriptionPlanEntity, {
        where: {
          user: {
            id: user.uid,
          },
          isActive: true,
          endDate: MoreThan(new Date()), // 大于当前时间
        },
      })
      if (userPlan)
        throw new BusinessException('当前已有订阅，不能继续订阅')

      // 判断用户是否存在未完成的订单
      const order = await manager.findOne(OrderEntity, {
        where: {
          user: {
            id: user.uid,
          },
          status: OrderStatus.DEFAULT,
          updatedAt: Between(new Date(), new Date(Date.now() - 5 * 60 * 1000)),
        },
      })
      if (order)
        throw new BusinessException('当前已有未支付订单，请先支付')

      const id = Kits.generateStr()
      const priceObj = await this.getFee(user, false, type, time, couponCode)

      if (couponCode) {
        getLogger().log(`[Order] Use coupon: ${couponCode} | PriceMeta: ${JSON.stringify(priceObj.meta)}`)
        const totalFee = priceObj.meta.fee

        await this.couponService.useCoupon(user, id, couponCode, totalFee)
      }

      const userEntity = await manager.findOne(UserEntity, {
        where: {
          id: user.uid,
        },
      })

      // 生成订单子项
      // 每一个info都需要生成
      const items = priceObj.info.map((item) => {
        // 如果价格parse错误会自动报错 / 取消事务
        const price = +item.price

        if (Number.isNaN(price))
          throw new BusinessException('价格错误')

        return manager.create(OrderItemEntity, {
          // order: {
          //   id,
          // },
          name: item.name,
          quantity: 1,
          price,
          additionalInfo: encodeObject({ free: item.free }),
        })
      })

      const startDate = Date.now() + 5 * 60 * 1000
      const endDate = startDate + priceObj.meta.range * 24 * 60 * 60 * 1000

      const plan = manager.create(SubscriptionPlanEntity, {
        user: userEntity,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: false,
        orderId: id,
        autoRenew: false,
        isTrial: String(subscribeDto.time).includes('TRIAL'),
      })

      await plan.save()

      // @ts-expect-error return value ignored
      const totalPrice = priceObj.meta.feeTax

      // 判断是不是整数 不能是小数
      if (!Number.isInteger(totalPrice) || totalPrice <= 0) {
        throw new BusinessException('价格计算错误，请联系管理员！')
      }

      console.log('[Order] Plan created.')

      if (payMethod === PaymentMethod.BALANCE) {
        const res = await this.createBalanceOrder(id, priceObj.name, userEntity, items, totalPrice, {
          type: 'SUBSCRIPTION',
          subscription: {
            type,
            time,
            ...priceObj,
          },
          plan,
        })

        // normal
        this.activeSubscription(id)

        return res
      }

      return this.createOrder(id, priceObj.name, userEntity, items, totalPrice, {
        type: 'SUBSCRIPTION',
        subscription: {
          type,
          time,
          ...priceObj,
        },
        plan,
      })
    })
  }

  /**
   * 检验用户余额是否足够
   * @param uid User
   * @param amo 单位：分
   */
  async validateBalance(uid: number, amo: number) {
    return this.entityManager.findOneBy(PointsSummaryEntity, {
      user: {
        id: uid,
      },
      availablePoints: MoreThan(amo),
    })
  }

  async dummyOrder(user: IAuthUser, dummyDto: DummyOrderDto) {
    const { value, couponCode } = dummyDto

    return this.entityManager.transaction(async (manager) => {
      // 判断用户是否存在未完成的订单
      const order = await manager.findOne(OrderEntity, {
        where: {
          user: {
            id: user.uid,
          },
          status: OrderStatus.DEFAULT,
          updatedAt: Between(new Date(), new Date(Date.now() - 5 * 60 * 1000)),
        },
      })
      if (order)
        throw new BusinessException('当前已有未支付订单，请先支付')

      const id = Kits.generateStr()
      const priceObj = await this.getDummyFee(user, value, couponCode)

      if (couponCode) {
        getLogger().log(`[Order] Use coupon: ${couponCode} | PriceMeta: ${JSON.stringify(priceObj.meta)}`)
        const totalFee = priceObj.meta.fee

        await this.couponService.useCoupon(user, id, couponCode, totalFee)
      }

      const userEntity = await manager.findOne(UserEntity, {
        where: {
          id: user.uid,
        },
      })

      // 生成订单子项
      // 每一个info都需要生成
      const items = priceObj.info.map((item) => {
        // 如果价格parse错误会自动报错 / 取消事务
        const price = +item.price

        if (Number.isNaN(price))
          throw new BusinessException('价格错误')

        return manager.create(OrderItemEntity, {
          // order: {
          //   id,
          // },
          name: item.name,
          quantity: 1,
          price,
          additionalInfo: encodeObject({ free: item.free }),
        })
      })

      // @ts-expect-error return value ignored
      const totalPrice = priceObj.meta.feeTax

      // 判断是不是整数 不能是小数
      if (!Number.isInteger(totalPrice) || totalPrice <= 0) {
        throw new BusinessException('价格计算错误，请联系管理员！')
      }

      this.redis.set(`ORDER-DUMMY:${id}`, userEntity.id)

      console.log('[Order] Dummy created.')

      return this.createOrder(id, priceObj.name, userEntity, items, totalPrice, {
        type: 'DUMMY',
        dummy: {
          value,
          ...priceObj,
        },
      })
    })
  }

  /**
   * 生成微信支付订单
   * @param id 订单ID
   * @param description 订单描述
   * @param user User
   * @param items Order SubItems
   * @param totalAmount 为提供自定义，请自行计算items总价传入，单位为分
   */
  async createOrder(id: string, description: string, user: UserEntity, items: OrderItemEntity[], totalAmount: number, addonInfo: any) {
    return this.entityManager.transaction(async (manager) => {
      console.log('createOrder', id, description, user, totalAmount, addonInfo)

      // generate id
      // const id = Kits.generateStr()

      await manager.save(OrderItemEntity, items)

      // create order
      const order = await manager.save(OrderEntity, {
        id,
        user,
        items,
        status: OrderStatus.DEFAULT,
        totalAmount,
        description,
        paymentMethod: PaymentMethod.WECHAT,
        additionalInfo: encodeObject({
          meta: {
            ...addonInfo,
          },
        }),
      })

      console.log('Order Created')

      const expire_time = genRFCTime(order.createdAt.getTime() + 5 * 60 * 1000)
      const orderCallback = await $wxApi.createOrder({
        id,
        description,
        attach: '科塔锐行 | QuotaWish',
        total_fee: totalAmount,
        expire_time,
      })

      const { code_url } = orderCallback
      console.log('-------', orderCallback, 'order callback')

      if (!code_url) {
        getLogger().error('[FatalError] Create Order Failed', { code_url }, {
          id,
          description,
          attach: '科塔锐行 | QuotaWish',
          total_fee: totalAmount,
          expire_time,
        })

        throw new BusinessException('创建订单失败')
      }

      console.log('Order Created To Wechat', { code_url })

      // 将order相关信息都放到 redis 里面
      this.redis.set(`order:${id}`, JSON.stringify({
        order,
        code_url,
        expire_time,
      }), 'EX', 5 * 60)

      return {
        order,
        code_url,
      }
    })
  }

  /**
   * 生成余额支付订单
   * @param id 订单ID
   * @param description 订单描述
   * @param user User
   * @param items Order SubItems
   * @param totalAmount 为提供自定义，请自行计算items总价传入，单位为分
   */
  async createBalanceOrder(id: string, description: string, user: UserEntity, items: OrderItemEntity[], totalAmount: number, addonInfo: any) {
    const res = await this.validateBalance(user.id, totalAmount)

    if (isEmpty(res)) {
      throw new BusinessException('账户余额不足！')
    }

    return this.entityManager.transaction(async (manager) => {
      console.log('createBalanceOrder', id, description, user, totalAmount, addonInfo)

      await manager.save(OrderItemEntity, items)

      // create order
      const order = await manager.save(OrderEntity, {
        id,
        user,
        items,
        status: OrderStatus.DEFAULT,
        totalAmount,
        description,
        paymentMethod: PaymentMethod.BALANCE,
        additionalInfo: encodeObject({
          meta: {
            ...addonInfo,
          },
        }),
      })

      console.log('Order Created')

      const transaction = manager.create(PointsTransactionEntity, {
        user: {
          id: user.id,
        },
        summary: res,
        pointsChanged: -totalAmount,
        reason: `${description}`,
        orderId: id,
        expirationDate: null,
      })

      res.availablePoints -= totalAmount
      res.usedPoints += totalAmount
      res.totalPoints = res.availablePoints + res.usedPoints + res.freezedPoints

      await manager.save(transaction)
      await manager.save(res)

      order.status = OrderStatus.FINISH

      await manager.save(order)

      // 将order相关信息都放到 redis 里面
      this.redis.set(`order:${id}`, JSON.stringify({
        order,
      }), 'EX', 5 * 60)

      return {
        order,
      }
    })
  }

  // 获取某个订单的详细信息
  async getOrderStatus(uid: number, id: string) {
    const order = await this.entityManager.findOne(OrderEntity, {
      where: {
        user: {
          id: uid,
        },
        id,
      },
      relations: ['items'],
    })

    return order
  }

  // 查询某个用户的历史订单（近180天）[updatedAt] / 最多30条
  async getOrders(id: number) {
    const [endTime, startTime] = [new Date(), new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000)]

    return this.orderRepository.find({
      where: {
        user: {
          id,
        },
        updatedAt: Between(startTime, endTime),
      },
      order: {
        updatedAt: 'DESC',
      },
      relations: ['items'],
      take: 30,
    })
  }

  async getNearestOrder(user: IAuthUser) {
    const order = await this.orderRepository.findOne({
      where: {
        user: {
          id: user.uid,
        },
        status: OrderStatus.DEFAULT,
      },
      order: {
        updatedAt: 'DESC',
      },
    })

    if (!order)
      return null

    // 去 redis 拿订单信息
    const totalOrderInfo = await this.redis.get(`order:${order.id}`)

    return JSON.parse(totalOrderInfo)
  }

  async getOrder(id: string) {
    // 优先cache
    const result = await this.redis.get(`order:${id}`)
    if (!result) {
      const order = await this.orderRepository.findOne({
        where: {
          id,
        },
      })

      await this.redis.set(`order:${id}`, JSON.stringify(order), 'EX', 300)

      return order
    }

    return result
  }

  /**
   * Wechat Payment Callback Notification(SUCCESS)
   */
  async callbackOrder(res: any, resource: any) {
    // 更新订单状态 悲观锁
    // 流程：1.先判断订单是否处理 2.再判断订单是否支付成功 3.再更新订单状态
    await this.entityManager.transaction(async (manager) => {
      const order = await manager.findOne(OrderEntity, {
        where: {
          id: resource.out_trade_no,
        },
        lock: {
          mode: 'pessimistic_write', // 悲观锁
        },
      })
      if (!order) {
        getLogger().log(`[Order] [WechatPay] 订单不存在，订单号：${resource.out_trade_no} | 已自动忽略`)
        return
      }

      // 如果支付方式不一致，则抛出异常，并且记录
      if (order.paymentMethod !== PaymentMethod.WECHAT) {
        throw new Error('Payment method mismatch')
      }

      // 存到 order 的 additionalInfo
      const info = order.additionalInfo ? JSON.parse(decodeURIComponent(atob(order.additionalInfo))) : {}

      info.records = [
        ...(info?.records || []),
        {
          transaction_id: resource.transaction_id,
          trade_type: resource.trade_type,
          bank_type: resource.bank_type,
          attach: resource.attach,
          success_time: resource.success_time,
          payer: resource.payer,
          amount: resource.amount,
          id: res.id,
          event_type: res.event_type,
          summary: res.summary,
        },
      ]

      getLogger().log(`[Order] [WechatPay] Coming callback ${info.meta.type} - ${order.id}`)

      if (info.meta.type === 'SUBSCRIPTION') {
        info.meta.plan.isActive = true
        setTimeout(() => this.activeSubscription(order.id))
      }
      else if (info.meta.type === 'DUMMY') {
        setTimeout(() => this.activeDummy(order.id, info))
      }

      order.additionalInfo = btoa(encodeURIComponent(JSON.stringify(info)))

      // 判断订单状态 暂不处理支付成功以外任何情况
      // 其他情况保持记录
      if (resource.trade_state !== WechatTradeState.SUCCESS) {
        await manager.save(OrderEntity, order)
        return
      }

      // 如果订单此时已经不处于正确状态，比如已经超时，则需要记录日志，并且上报退款
      if (order.status !== OrderStatus.DEFAULT) {
        if (order.status !== OrderStatus.FINISH) {
          // TODO withdraw
          getLogger().error('Order status is not correct, order id: ', order.id, resource, res)
          return
        }
        else {
          getLogger().log(`[Order] [WeChatPay] 订单状态已完成，订单号：${order.id} | 已自动忽略`)
        }
      }

      order.status = OrderStatus.FINISH

      // 同步到redis
      await this.redis.set(`order:${order.id}`, JSON.stringify(order), 'EX', 600)

      await manager.save(OrderEntity, order)

      setTimeout(() => {
        $event.emit('USER_PAY_SUCCESS', order)
      })

      getLogger().log(`[Order] [WechatPay] 订单 ${order.id} 支付成功，状态已变更，信息已同步！`, resource, order)
    })

    return {
      code: 'SUCCESS',
      // message: 'SUCCESS',
    }
  }

  async activeSubscription(orderId: string) {
    const subscription = await this.entityManager.findOne(SubscriptionPlanEntity, {
      where: { orderId, isActive: false },
      relations: ['user'],
    })

    if (!isEmpty(subscription)) {
      getLogger().log(`[Order] [Subscription] 微信支付回调 #${orderId} | 尝试激活用户订阅 - ${subscription.id}`)

      subscription.isActive = true

      await subscription.save()

      // update redis cache
      await this.redis.set(`user:${subscription.user.id}:subscription`, JSON.stringify(subscription), 'EX', 60 * 15)

      getLogger().log(`[Order] [Subscription] 微信支付回调 #${orderId} | 已激活用户订阅`)
    }
  }

  async activeDummy(orderId: string, info: any) {
    getLogger().log(`[Order] [Dummy] 微信支付回调 #${orderId} | 尝试激活用户积分 - ${info.meta}`)

    const isExist = await this.redis.exists(`ORDER-DUMMY:${orderId}`)
    if (!isExist) {
      getLogger().error(`[Order] [WechatPay] Dummy order ${orderId} not found`)
      return
    }

    const uid = +(await this.redis.get(`ORDER-DUMMY:${orderId}`))

    this.entityManager.transaction(async (manager) => {
      const order = await manager.findOneBy(OrderEntity, {
        id: orderId,
      })

      if (isEmpty(order)) {
        getLogger().error(`[Order] [WechatPay] Order ${orderId} not found`)
        return
      }

      const summary = await manager.findOneBy(PointsSummaryEntity, {
        user: {
          id: uid,
        },
      })

      const dummyAmo = info.meta.dummy?.value || 0

      const dummyTransaction = manager.create(PointsTransactionEntity, {
        user: {
          id: uid,
        },
        summary,
        pointsChanged: dummyAmo,
        reason: info.meta.dummy.name,
        orderId,
        expirationDate: null,
      })

      summary.availablePoints += dummyAmo
      summary.totalPoints = summary.availablePoints + summary.usedPoints + summary.freezedPoints

      await dummyTransaction.save()
      await summary.save()

      await this.redis.del(`ORDER-DUMMY:${orderId}`)
      await this.redis.del(`USER:DUMMY:${uid}`)

      getLogger().log(`[Order] [Dummy] 微信支付回调 #${orderId} | 已激活用户积分 ${dummyAmo}`)
    })
  }

  // 清理订单状态，主要做的事情如下：
  // 1. 判断订单是否超时：超时则将订单状态设置为超时
  // 2. 判断订单是否支付成功：支付成功则将订单状态设置为完成
  // 3. 根据订单状态决定是否要去查询订单
  // 4. TODO 如果存在退款等需要审核的订单，疯狂轰炸管理员
  @CronOnce(CronExpression.EVERY_5_MINUTES)
  async refreshOrderStatus() {
    getLogger().log('--> Starting to clear order status')

    // 查询近10分钟更新的订单
    const [endTime, startTime] = [new Date(), new Date(new Date().getTime() - 10 * 60 * 1000)]
    const orders = await this.orderRepository.find({
      where: {
        updatedAt: Between(startTime, endTime),
      },
      relations: ['items', 'user'],
    })

    for (const order of orders) {
      this.entityManager.transaction(async (manager) => {
        // 判断订单是否支付成功：支付成功则将订单状态设置为完成
        if (order.status === OrderStatus.DEFAULT) {
          // 如果订单已经5分钟都没有支付，则去微信查询，查询完毕后没有支付，则等下一轮扫描
          // 如果支付成功，则将订单状态设置为完成
          // TODO
        }

        // 判断订单是否超时
        if (order.status === OrderStatus.DEFAULT && order.updatedAt.getTime() < new Date().getTime() - 5 * 60 * 1000) {
          // 优先判断是否已经支付

          order.status = OrderStatus.TIMEOUT_PAY
          await this.orderRepository.save(order)

          // 微信会自动去关闭微信订单
        }

        // 如果订单状态已支付，则要给订阅生效
        const info = order.additionalInfo ? JSON.parse(decodeURIComponent(atob(order.additionalInfo))) : {}
        if (order.status === OrderStatus.FINISH && info.meta) {
          // 获取订阅信息
          const { meta } = info
          if (meta.type === 'SUBSCRIPTION') {
            const { plan } = meta

            // 先拿到订阅 如果拿不到isActive false就证明订阅已经搞定了
            const subscription = await manager.findOne(SubscriptionPlanEntity, {
              where: { id: plan.id, isActive: false },
            })

            if (subscription) {
              subscription.isActive = true

              info.meta.plan.isActive = true

              order.additionalInfo = btoa(encodeURIComponent(JSON.stringify(info)))

              await manager.save(OrderEntity, order)
              await manager.save(SubscriptionPlanEntity, subscription)

              getLogger().log('--> Subscription plan activated: %s', plan.name, ' Details: ', meta, order.user.nickname, order.user.username)
            }
          }
          else if (meta.type === 'DUMMY') {
            const transaction = await manager.findOne(PointsTransactionEntity, {
              where: {
                orderId: order.id,
              },
            })

            if (!isEmpty(transaction)) {
              this.activeDummy(order.id, info)

              getLogger().log('--> Dummy activated: %s', order.id, ' Details: ', meta, order.user.nickname, order.user.username)
            }
          }
        }
      })
    }

    getLogger().log('--> Finished to clear order status')
  }

  // 获得订单列表
  async getOrderList({ page, pageSize, status, payMethod, user_id, min_price, max_price, min_pay_time, max_pay_time, ...data }: OrderQueryDto) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('order_items', 'items', 'items.order_id = orders.id')
      .where({
        ...(user_id ? { user: { id: user_id } } : null),
        ...(min_price ? { price: MoreThanOrEqual(min_price) } : null),
        ...(max_price ? { price: LessThanOrEqual(max_price) } : null),
        ...(min_pay_time ? { payTime: MoreThanOrEqual(min_pay_time) } : null),
        ...(max_pay_time ? { payTime: LessThanOrEqual(max_pay_time) } : null),
        ...(payMethod ? { payMethod } : null),
        ...(status ? { status } : null),
      })
      .orderBy('orders.updatedAt', 'DESC')

    return paginate<OrderEntity>(queryBuilder, { page, pageSize })
  }

  // 统计信息
  // 1. payStatus 即 x笔成功交易 x笔失败交易 比例 （放弃率等）
  // 2. 累计成交价格 近1月内的成交价格
  // 3. 统计哪一种支付方式最多
  async getOrderStatistics() {
    // 统计一个月内的交易
    const [endTime, startTime] = [new Date(), new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)]

    const queryBuilder = this.orderRepository
      .createQueryBuilder('orders')
      .where({
        updatedAt: Between(startTime, endTime),
      })

    const orders = await queryBuilder.getMany()

    return {
      payStatus: {
        success: orders.filter(order => order.status === OrderStatus.FINISH).length,
      },
      totalPrice: orders.reduce((acc, cur) => acc + cur.totalAmount, 0),
      orders,
    }
  }
}
