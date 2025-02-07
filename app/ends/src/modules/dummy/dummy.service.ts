import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import { Between, EntityManager, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'

import { genDailyFortune } from '~/common/addon/fortune'
import { ASigninManager } from '~/common/addon/fortune/signin'
import { $event } from '~/common/eventbus/init'
import { BusinessException } from '~/common/exceptions/biz.exception'

import { getLogger } from '~/common/interceptors/logging.interceptor'
import { encodeText, genCouponCode } from '~/utils'

import { PaymentCouponEntity } from '../coupon/coupon.entity'
import { InvitationRecordEntity } from '../invitation/invitation.entity'

import { SigninEntity } from '../order/order.entity'
import { UserEntity } from '../user/user.entity'

import { FortuneRecordEntity, LotteryEntity, LotteryRecordEntity, PointsSummaryEntity, PointsTransactionEntity } from './dummy.entity'

class SigninManager extends ASigninManager {
  constructor(@InjectEntityManager() private entityManager: EntityManager, @InjectRedis() private redis: Redis) {
    super()
  }

  public async getUserSignData(year: number, month: number, uid: number): Promise<string> {
    const res = await this.entityManager.findOneBy(SigninEntity, {
      user: {
        id: uid,
      },
      year,
      month,
    })

    if (isEmpty(res)) {
      return ''
    }

    return res.day
  }

  public async saveUserSignData(year: number, month: number, uid: number, data: string): Promise<boolean> {
    const res = await this.entityManager.findOneBy(SigninEntity, {
      user: {
        id: uid,
      },
      year,
      month,
    })

    let entity: SigninEntity

    if (isEmpty(res)) {
      entity = this.entityManager.create(SigninEntity, {
        user: {
          id: uid,
        },
        year,
        month,
        day: data,
      })

      await entity.save()
    }
    else {
      await this.entityManager.update(SigninEntity, { id: res.id }, {
        user: {
          id: uid,
        },
        year,
        month,
        day: data,
      })
    }

    return true
  }
}

@Injectable()
export class DummyService {
  private readonly signinManager: SigninManager

  constructor(
    @InjectRepository(PointsSummaryEntity)
    private dummyRepository: Repository<PointsSummaryEntity>,
    @InjectRepository(LotteryEntity)
    private lotteryRepository: Repository<LotteryEntity>,
    @InjectRepository(LotteryRecordEntity)
    private lotteryRecordRepository: Repository<LotteryRecordEntity>,

    @InjectRedis() private redis: Redis,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {
    $event.on('USER_INVITATION_SUCCESS', async (inviteUser: UserEntity) => {
      await this.lotteryRepository.save({
        user: {
          id: inviteUser.id,
        },
        used: false,
        source: 'USER_INVITATION',
        arrival_at: new Date(),
      })

      getLogger().log(`[UserInvitation] [DummyLottery] Invite success +1 amount. ${inviteUser.nickname}#${inviteUser.id} / ${inviteUser.phone}`)
    })

    this.signinManager = new SigninManager(entityManager, redis)
  }

  // 抽奖非常消耗资源 所以1秒只能抽奖一次
  async lottery(uid: number) {
    // 查询用户剩余次数并且在有效期
    const lotteryRecords = await this.lotteryRepository.findBy({
      user: {
        id: uid,
      },
      // used: false,
      // expired_at: MoreThanOrEqual(new Date()),
    })

    const todayDay = new Date()
    todayDay.setHours(0, 0, 0, 0)

    // 获取其中已经抽过的 或者 已过期的
    const accumulateAmo = lotteryRecords.filter(item => item.used || (item.expired_at && item.expired_at < new Date()))

    // 获取其中是今天之内抽的
    const todayAmo = accumulateAmo.filter(item => item.used === true && item.used_at.getTime() >= todayDay.getTime())

    // console.log('lottery', lotteryRecords, accumulateAmo, todayAmo)

    if (lotteryRecords.length - accumulateAmo.length < 1) {
      throw new BusinessException('抽奖次数不足')
    }

    const invitationRecords = await this.dummyRepository.manager.findBy(InvitationRecordEntity, {
      inviteUser: {
        id: uid,
      },
    })

    // 抽取第一个次数
    const popLottery = lotteryRecords.find(item => item.used === false)

    // 定义奖品
    let prizes = []

    if (popLottery.source === 'NEW_USER_FREE') {
      prizes = [3, 4]
    }

    if (popLottery.source === 'DAILY_USER_FREE') {
      prizes = [3, 4, -1]
    }

    if (popLottery.source === 'USER_INVITATION') {
      prizes = [4, 3, 2, 1, 0]
    }

    const res = handleLottery([accumulateAmo.filter(item => item.used)?.length, todayAmo.length, invitationRecords.length], prizes, {
      free: popLottery.source === 'DAILY_USER_FREE',
      paid: false, // TODO
      invitation: popLottery.source === 'USER_INVITATION',
    })

    popLottery.used = true
    popLottery.used_at = new Date()

    const lotteryRecord = this.lotteryRecordRepository.create({
      lottery: popLottery,
      user: {
        id: uid,
      },
      win_at: new Date(),
      win_type: res,
      win_type_desc: '',
    })

    let result = {}

    if (res === -1) {
      result = {
        type: -1,
        label: '谢谢参与',
        description: '科塔锐行祝您一帆风顺，节节高升',
        text: '',
      }
    }
    else if (res === 4) {
      // TODO
      result = {
        type: 4,
        label: '阳光普照奖',
        description: '科塔锐行标准订阅计划优惠券x1',
        text: '-4.9元',
      }

      lotteryRecord.win_type_desc = '科塔锐行标准订阅计划优惠券x1(4.9元, 试用不适用)'

      // create Coupon
      const { code, mainCode } = genCouponCode('THISAI')

      // 设置有效期 今天-3天后
      const couponStart = new Date()
      const couponEnd = new Date(couponStart.getTime() + 3 * 24 * 60 * 60 * 1000)

      const coupon = this.dummyRepository.manager.create(PaymentCouponEntity, {
        code,
        mainCode,
        discountAmount: 490,
        startDate: couponStart,
        endDate: couponEnd,
        maxUsage: 1,
        minimumSpend: 1,
        maximumDiscount: 490,
        stackable: false,
        newUserOnly: false,
        creator: {
          id: uid,
        },
        updater: {
          id: uid,
        },
        user: {
          id: uid,
        },
      })

      await coupon.save()
    }
    else if (res === 3) {
      result = {
        type: 3,
        label: '三等奖',
        description: '科塔文娱定制碳素笔x1',
        text: '',
      }
    }
    else if (res === 2) {
      result = {
        type: 2,
        label: '二等奖',
        description: '科塔文娱定制方巾小熊x1',
        text: '',
      }
    }
    else if (res === 1) {
      result = {
        type: 1,
        label: '一等奖',
        description: '科塔文娱定制精美玻璃杯x1',
        text: '',
      }
    }
    else if (res === 0) {
      // TODO 严格限制每天只能有一个

      result = {
        type: 0,
        label: '特等奖',
        description: '科塔锐行请你吃饭 | 29.98 提现红包',
        text: '',
      }
    }
    else {
      throw new BusinessException('抽奖异常')
    }

    await this.lotteryRepository.save(popLottery)
    await this.lotteryRecordRepository.save(lotteryRecord)

    return result
  }

  async getLotteryDummy(uid: number) {
    // 获得用户的抽奖记录 根据抽奖类型去计算幸运值
    // -1: 谢谢参与 => 0
    // 4: 阳光普照奖 => 1
    // 3: 三等奖 => 2
    // 2: 二等奖 => 3
    // 1: 一等奖 => 4
    const lotteryRecords = await this.lotteryRecordRepository.findBy({
      user: {
        id: uid,
      },
    })

    let dummy = 0

    for (const item of lotteryRecords) {
      if (item.win_type === 4)
        dummy += 1
      else if (item.win_type === 3)
        dummy += 2
      else if (item.win_type === 2)
        dummy += 3
      else if (item.win_type === 1)
        dummy += 4
    }

    return dummy
  }

  async lotteryCount(uid: number) {
    // 查询用户所有次数 如果没有任何关于用户的记录则自动添加一条（按照used分组）
    const queryBuilder = this.lotteryRepository.createQueryBuilder('lottery')

    const res = await queryBuilder
      .select(['COUNT(lottery.id) AS count', 'lottery.used'])
      .where({
        user: {
          id: uid,
        },
      })
      .groupBy('lottery.used')
      .getRawMany()

    if (res.length === 0) {
      // 新建新用户免费的
      await this.lotteryRepository.save({
        user: {
          id: uid,
        },
        used: false,
        source: 'NEW_USER_FREE',
      })

      return this.lotteryCount(uid)
    }

    // 判断今天有没有领过 即创建时间在今天凌晨以后的 source为DAILY_USER_FREE的记录
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dailyUserFree = await queryBuilder
      .select(['COUNT(lottery.id) AS count'])
      .where({
        user: {
          id: uid,
        },
        source: 'DAILY_USER_FREE',
        arrival_at: MoreThanOrEqual(today),
      })
      .getRawOne()

    console.log('dailyUserFree', dailyUserFree)

    // 判断有没有今日领过
    if (dailyUserFree?.count > 0) {
      // 领过
      // 获取过期的数量
      const expired = await queryBuilder
        .select(['COUNT(lottery.id) AS count'])
        .where({
          user: {
            id: uid,
          },
          used: false,
          expired_at: LessThanOrEqual(today),
        }).getCount()

      return [res, expired]
    }

    // 创建每日免费
    await this.lotteryRepository.save({
      user: {
        id: uid,
      },
      used: false,
      source: 'DAILY_USER_FREE',
      arrival_at: today,
      expired_at: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    })

    console.log('res', res)

    return this.lotteryCount(uid)
  }

  async getDailyFortune(uid: number) {
    // 获得今天凌晨到23:59:59的时间戳范围
    const startTime = new Date()
    startTime.setHours(0, 0, 0, 0)
    const endTime = new Date()
    endTime.setHours(23, 59, 59, 999)

    let res = await this.lotteryRepository.manager.findOneBy(FortuneRecordEntity, {
      user: {
        id: uid,
      },
      updatedAt: Between(startTime, endTime),
    })

    if (isEmpty(res)) {
      const result = genDailyFortune()

      res = await this.lotteryRepository.manager.save(FortuneRecordEntity, {
        user: {
          id: uid,
        },
        main: result.main.name,
        content: encodeText(JSON.stringify(result)),
      })
    }

    return res
  }

  async getUserPoints(id: number) {
    const key = `USER:DUMMY:${id}`
    // 判断 redis 中存不存在
    const exist = await this.redis.exists(key)
    if (!exist) {
      let summary = await this.dummyRepository.findOneBy({ user: { id } })

      if (isEmpty(summary)) {
        summary = this.dummyRepository.create({
          user: { id },
          totalPoints: 0.00,
          availablePoints: 0.00,
          usedPoints: 0.00,
          freezedPoints: 0.00,
        })

        await summary.save()

        getLogger().log('info', `用户 ${id} 积分初始化`)
      }

      await this.redis.set(key, JSON.stringify(summary), 'EX', 120)
    }

    const result = await this.redis.get(key)

    return JSON.parse(result || '')
  }

  /**
   * 每日签到
   */
  async signToday(user: IAuthUser) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    // signinManager
    return this.signinManager.sign(year, month, day, user.uid)
  }

  /**
   * 连续签到奖励
   */
  async getSignReward(user: IAuthUser) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // 获取本月连续签到奖励
    const signData = await this.getSignCalendar(user, year, month)

    // 加积分
    this.entityManager.transaction(async (manager) => {
      const summary = await manager.findOneBy(PointsSummaryEntity, {
        user: {
          id: user.uid,
        },
      })

      const dummyAmo = signData.amount * 10

      const dummyTransaction = manager.create(PointsTransactionEntity, {
        user: {
          id: user.uid,
        },
        summary,
        pointsChanged: dummyAmo,
        reason: `连续签到${signData.amount}天奖励`,
      })

      summary.availablePoints += dummyAmo
      summary.totalPoints = summary.availablePoints + summary.usedPoints + summary.freezedPoints

      await dummyTransaction.save()
      await summary.save()

      await this.redis.del(`USER:DUMMY:${user.uid}`)

      getLogger().log(`[Signin] [Dummy] 连续签到 #${signData.amount} 天奖励 | 已激活用户积分 ${dummyAmo}`)
    })

    if (signData.amount % 7 !== 0 && signData.amount % 3 !== 0) {
      return
    }

    const discountPrice = signData.amount % 7 === 0 ? 2000 : 1000

    // create Coupon
    const { code, mainCode } = genCouponCode('THISAI')

    // 设置有效期 今天->3天后
    const couponStart = new Date()
    const couponEnd = new Date(couponStart.getTime() + 3 * 24 * 60 * 60 * 1000)

    const coupon = this.dummyRepository.manager.create(PaymentCouponEntity, {
      code,
      mainCode,
      discountAmount: discountPrice,
      startDate: couponStart,
      endDate: couponEnd,
      maxUsage: 1,
      minimumSpend: 1,
      maximumDiscount: discountPrice,
      stackable: false,
      newUserOnly: false,
      creator: {
        id: user.uid,
      },
      updater: {
        id: user.uid,
      },
      user: {
        id: user.uid,
      },
    })

    await coupon.save()
  }

  /**
   * 获取某一个月的签到日历
   */
  async getSignCalendar(user: IAuthUser, year: number, month: number) {
    return this.signinManager.getUserAccumulatedSignDays(year, month, user.uid)
  }
}

function handleLottery(nums, prizes, meta) {
  const [total, today, inviters] = nums

  console.log('抽奖', nums, prizes, meta)

  if (total === 0 && today === 0) {
    return Math.random() <= 0.058 ? prizes[1] : prizes[0]
  }

  // 如果用户是每日免费机会
  if (meta?.free) {
    // 大概率是谢谢惠顾 中等概率是四等奖 小概率是三等奖
    const random = [0.005, 0.285, 0.7]

    return Math.random() <= random[0] ? prizes[2] : Math.random() <= random[1] ? prizes[1] : prizes[0]
  }

  // 如果用户是邀请拉新抽奖
  if (meta?.invitation) {
    // 阶梯式抽奖
    // 用户的抽奖累计抽奖次数以及当日抽奖次数折算比例 1:5
    let priority = (total / 5 + today) / 100

    // 如果用户是付费用户 那么概率再加3%
    if (meta?.paid) {
      priority += 0.03
    }

    // 按照用户拉的人来算 一个人涨0.5% 封顶20%
    const inviter = (Math.min((inviters || 0), 30) / 50)

    // priority 和 inviter 按照 1:5折算
    const rate = (priority + inviter * 20) / 10

    const totalLen = prizes.length
    let ind = totalLen

    while (ind--) {
      // 如果 ind 是最后一个 额外减少5%的概率
      let subRate = rate / (ind * ind)

      if (ind + 1 === totalLen) {
        subRate -= 0.075
      }

      if (Math.random() <= subRate) {
        return prizes[ind]
      }
    }

    return prizes[0]
  }

  return -1
}
