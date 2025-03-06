import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import { Lang, QrcodeApi, ScopeEnum, SnsAccessTokenApi } from 'tnwx'
import { Repository } from 'typeorm'

import { getLogger } from '~/common/interceptors/logging.interceptor'

import { AuthService } from '../auth/auth.service'
import { UserService } from '../user/user.service'

import { CodeStatus } from './platform.dto'
import { ThirdPartyBindingEntity } from './platform.entity'

const defaultLoginCodeTime = 300

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(ThirdPartyBindingEntity)
    private thirdPartyBindingRepository: Repository<ThirdPartyBindingEntity>,
    @InjectRedis() private redis: Redis,
    private userService: UserService,
    private authService: AuthService,
  ) { }

  async tryWechatPlatformLogin() {
    const loginCode = getRandomLoginQuery()

    // record in redis with expire time
    await this.redis.set(`login_${loginCode}`, CodeStatus.AVAILABLE, 'EX', defaultLoginCodeTime)

    const res = await QrcodeApi.createTemporaryByStr(defaultLoginCodeTime, `login_${loginCode}`)

    return {
      ...res,
      loginCode,
    }
  }

  async handleWechatAuthorize(code: string, state: string) {
    const data = await SnsAccessTokenApi.getSnsAccessToken(code)

    // 判断 access_token 是否获取成功
    if (data.errcode) {
      getLogger().warn(data)
      return CodeStatus.UNAVAILABLE
    }

    const status = +(await this.redis.get(`login_${state}`))
    if (status === CodeStatus.AVAILABLE) {
      getLogger().warn(`未经过标准认证流程的 state: ${state}|${status}`)
      return CodeStatus.UNAVAILABLE
    }

    const { access_token, refresh_token, openid, scope, expires_in, is_snapshotuser } = data
    if (is_snapshotuser) {
      getLogger().warn(`用户 ${openid} 尝试使用快照用户登录`)
      return CodeStatus.UNAVAILABLE
    }

    if (scope !== ScopeEnum.SNSAPI_USERINFO) {
      getLogger().warn(`用户 ${openid} 尝试使用非 SNSAPI_USERINFO 登录`)
      getLogger().log(data)
      return CodeStatus.UNAVAILABLE
    }

    const user = await this.redis.get(`info:login_${state}`)

    getLogger().log(`[Platform] [Authorize] 用户 ${openid} 尝试使用微信登录 | ${state} with status ${status}`)

    return this.thirdPartyBindingRepository.manager.transaction(async (manager) => {
      // 开始查询用户是否存在系统
      const res = await manager.findOne(ThirdPartyBindingEntity, { where: { openId: user, provider: 'wechat' } })

      getLogger().log(`[Platform] [Authorize] User binding`, res)

      const meta: any = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      }

      const info = await SnsAccessTokenApi.getUserInfo(access_token, openid, Lang.ZH_CN)

      meta.info = info

      // 不存在则要求先绑定新建用户 / 或者未绑定也必须绑定
      // 可以十分钟之内携带 state 使用短信登录来绑定手机号
      if (isEmpty(res) || !res.isActive || !res.user?.id) {
        await this.redis.set(`login_${state}`, CodeStatus.NEED_BIND, 'EX', 600)
        await this.redis.set(`info:login_${state}`, user, 'EX', 600)

        getLogger().log(`[Platform] [Authorize] User binding not found, create new bind request.`)

        if (isEmpty(res)) {
          await manager.save(ThirdPartyBindingEntity, {
            openId: user,
            isActive: false,
            provider: 'wechat',
            meta: btoa(encodeURIComponent(JSON.stringify(meta))),
          })

          getLogger().log(`[Platform] [Authorize] User binding created!`)
        }

        return CodeStatus.NEED_BIND
      }

      await manager.update(ThirdPartyBindingEntity, res.id, {
        openId: user,
        isActive: true,
        provider: 'wechat',
        meta: btoa(encodeURIComponent(JSON.stringify(meta))),
      })

      await this.redis.set(`login_${state}`, CodeStatus.SUCCESS, 'EX', 120)
      await this.redis.set(`info:login_${state}`, res.user.id, 'EX', 120)

      return 'success'
    })
  }

  async getCodeStatus(loginCode: string) {
    // 判断存不存在
    const exist = await this.redis.exists(`login_${loginCode}`)
    if (!exist)
      return null

    const status = +(await this.redis.get(`login_${loginCode}`))

    if (status === CodeStatus.AVAILABLE) {
      return CodeStatus.AVAILABLE
    }

    const user = await this.redis.get(`info:login_${loginCode}`)
    if (!user) {
      return CodeStatus.UNAVAILABLE
    }

    return status
    // 为防止刷接口，增加事务
    // await this.dummyRepository.manager.transaction(async (manager) => {
    //   // 开始查询用户是否存在系统
    //   const res = await manager.findOne(ThirdPartyBindingEntity, { where: { openId: user, provider: platform } })

    //   // 不存在则新建用户
    //   if (!res) {

    //   }
    // })
  }

  async getUserPlatformList(user: IAuthUser) {
    const result = await this.thirdPartyBindingRepository.find({
      where: {
        user: {
          id: user.uid,
        },
      },
    })

    return result.map(item => ({
      id: item.id,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      provider: item.provider,
      isActive: item.isActive,
      openId: getHiddenString(item.openId),
    }))
  }
}

function getHiddenString(str: string) {
  return `${str.slice(0, 3)}****${str.slice(-3)}`
}

function getRandomLoginQuery() {
  let loginCode = Math.random().toString(36).substring(2, 10)

  while (loginCode.length < 8) {
    loginCode += '0'
  }

  return loginCode
}
