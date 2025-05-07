import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Inject, Injectable } from '@nestjs/common'

import { InjectEntityManager } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'

import { EntityManager } from 'typeorm'

import { $event } from '~/common/eventbus/init'
import { BusinessException } from '~/common/exceptions/biz.exception'

import { getLogger } from '~/common/interceptors/logging.interceptor'
import { $larkSuite } from '~/common/larksuite/init'
import { injectCache } from '~/common/tnwx/init'
import { msgAdapterController } from '~/common/tnwx/msg-adapter'
import { AppConfig, IAppConfig, ISecurityConfig, SecurityConfig } from '~/config'
import { ErrorEnum } from '~/constants/error-code.constant'
import { genAuthPVKey, genAuthPermKey, genAuthTokenKey, genTokenBlacklistKey } from '~/helper/genRedisKey'

import { UserService } from '~/modules/user/user.service'

import { getIpAddress, md5 } from '~/utils'

import { CodeStatus } from '../platform/platform.dto'
import { ThirdPartyBindingEntity } from '../platform/platform.entity'
import { LoginLogService } from '../system/log/services/login-log.service'
import { MenuService } from '../system/menu/menu.service'
import { RoleService } from '../system/role/role.service'

import { UserEntity } from '../user/user.entity'

import { LoginType } from './dto/auth.dto'
import { RefreshTokenEntity } from './entities/refresh-token.entity'
import { LoginToken } from './models/auth.model'
import { TokenService } from './services/token.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private menuService: MenuService,
    private roleService: RoleService,
    private userService: UserService,
    private loginLogService: LoginLogService,
    private tokenService: TokenService,
    @Inject(SecurityConfig.KEY) private securityConfig: ISecurityConfig,
    @Inject(AppConfig.KEY) private appConfig: IAppConfig,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {
    injectCache(redis)

    msgAdapterController.initManager(entityManager)
    $larkSuite.init(redis)
  }

  async sendSMSCode(phone: string) {
    return new Promise<string[]>((resolve) => {
      const code = Math.floor(Math.random() * 900000 + 100000)

      // 实例化要请求产品的client对象,clientProfile是可选的
      // const client = new SmsClient(clientConfig)
      // const params = {
      //   PhoneNumberSet: [
      //     `+86${phone}`,
      //   ],
      //   SmsSdkAppId: '1400925576',
      //   TemplateId: '2218810',
      //   SignName: '四川科塔锐行科技',
      //   TemplateParamSet: [
      //     `${code}`,
      //     '10',
      //   ],
      // }

      // client.SendSms(params).then(
      //   (data) => {
      //     if (data.SendStatusSet[0].Code === 'Ok') {
      //       resolve(['true', `${code}`])
      //       return
      //     }

      //     console.log('a', data)

      //     resolve(['false', `${code}`, JSON.stringify(data)])
      //   },
      //   (err) => {
      //     console.error('error', err)

      //     resolve(['false', err])
      //   },
      // )
    })
  }

  async log(to: string, code: string, ip: string) {
    const getRemainTime = () => {
      const now = dayjs()
      return now.endOf('day').diff(now, 'second')
    }

    await this.redis.set(`sms-captcha:${to}`, code, 'EX', 60 * 5)

    const limitCountOfDay = await this.redis.get(`sms-captcha:${to}:limit-day`)
    const ipLimitCountOfDay = await this.redis.get(`ip:${ip}:send:limit-day`)

    await this.redis.set(`ip:${ip}:send:limit`, 1, 'EX', 60)
    await this.redis.set(`sms-captcha:${to}:limit`, 1, 'EX', 60)
    await this.redis.set(
      `sms-captcha:${to}:send:limit-count-day`,
      limitCountOfDay,
      'EX',
      getRemainTime(),
    )
    await this.redis.set(
      `ip:${ip}:send:limit-count-day`,
      ipLimitCountOfDay,
      'EX',
      getRemainTime(),
    )
  }

  async checkCode(to, code) {
    const ret = await this.redis.get(`sms-captcha:${to}`)
    if (ret !== code)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    await this.redis.del(`sms-captcha:${to}`)
  }

  async checkLimit(to, ip) {
    const LIMIT_TIME = 5

    // ip限制
    const ipLimit = await this.redis.get(`ip:${ip}:send:limit`)
    if (ipLimit)
      throw new BusinessException(ErrorEnum.TOO_MANY_REQUESTS)

    // 1分钟最多接收1条
    const limit = await this.redis.get(`sms-captcha:${to}:limit`)
    if (limit)
      throw new BusinessException(ErrorEnum.TOO_MANY_REQUESTS)

    // 1天一个邮箱最多接收5条
    let limitCountOfDay: string | number = await this.redis.get(
      `sms-captcha:${to}:limit-day`,
    )
    limitCountOfDay = limitCountOfDay ? Number(limitCountOfDay) : 0
    if (limitCountOfDay > LIMIT_TIME) {
      throw new BusinessException(
        ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY,
      )
    }

    // 1天一个ip最多发送5条
    let ipLimitCountOfDay: string | number = await this.redis.get(
      `ip:${ip}:send:limit-day`,
    )
    ipLimitCountOfDay = ipLimitCountOfDay ? Number(ipLimitCountOfDay) : 0
    if (ipLimitCountOfDay > LIMIT_TIME) {
      throw new BusinessException(
        ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY,
      )
    }
  }

  async validateUser(credential: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(credential)

    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

    if (user) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async smsLoginBindingPlatform(user: UserEntity, state: string) {
    this.entityManager.transaction(async (manager) => {
      const status = +(await this.redis.get(`login_${state}`))
      if (status !== CodeStatus.NEED_BIND)
        throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION)

      const info = await this.redis.get(`info:login_${state}`)
      if (!info)
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)

      const prevThirdParty = await manager.findOne(ThirdPartyBindingEntity, {
        where: {
          user: {
            id: user.id,
          },
          isActive: true,
          provider: 'wechat',
        },
      })

      // 只要能通过user查到其他用户
      if (prevThirdParty?.openId)
        throw new BusinessException('当前用户已绑定其他微信！')

      // const thirdParty = await this.entityManager.createQueryBuilder(ThirdPartyBindingEntity, 'thirdPartyBinding')
      //   .leftJoinAndSelect('thirdPartyBinding.user', 'user')
      //   .where('thirdPartyBinding.openId = :openId', { openId: info })
      //   .andWhere('thirdPartyBinding.provider = :provider', { provider: 'wechat' })
      //   .getOne()
      console.warn(`[UserInfo] State:${state} | Status:${status} |`, info)
      const thirdParty = await manager.findOne(ThirdPartyBindingEntity, {
        where: {
          openId: info,
          isActive: false,
          provider: 'wechat',
        },
      })

      if (isEmpty(thirdParty)) {
        getLogger().error('[UserInfo] State:', state, '| Status:', status, '|', info, thirdParty)

        throw new BusinessException('没有需要绑定的请求')
      }

      const meta = JSON.parse(decodeURIComponent(atob(thirdParty.meta)))

      // update thirdparty
      await manager.update(ThirdPartyBindingEntity, thirdParty.id, {
        isActive: true,
        user,
      })

      const { nickname, headimgurl } = meta.info

      await manager.update(UserEntity, user.id, {
        nickname: nickname.length <= 2 ? `${nickname}_QuotaWish` : nickname,
        avatar: headimgurl,
      })

      await this.redis.set(`login_${state}`, CodeStatus.SUCCESS, 'EX', 60)
      await this.redis.set(`info:login_${state}`, user.id, 'EX', 60)

      getLogger().log('info', `user ${user.id} binding success. => Platform | Wechat @${info}`)
    })
  }

  /**
   * 获取账号密码登录JWT
   */
  async login(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<LoginToken> {
    const user = await this.userService.findUserByUserName(username)
    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    if (user.password !== md5(`${password}${user.psalt}`)) {
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
    }

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua, LoginType.WEB_PHONE)

    const address = await getIpAddress(ip)
    $event.emit('USER_LOGIN_SUCCESS', user, LoginType.WEB_PHONE, ip, address)

    return token
  }

  /**
   * 获取短信登录JWT
   */
  async smsLogin(
    phone: string,
    code: string,
    ip: string,
    ua: string,
    state?: string,
  ): Promise<LoginToken> {
    await this.checkCode(phone, code)
    await this.userService.smsLoginReg(phone)

    const user = await this.userService.findUserByUserPhone(phone)
    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    if (state)
      await this.smsLoginBindingPlatform(user, state)

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua, LoginType.WEB_PHONE)

    const address = await getIpAddress(ip)
    $event.emit('USER_LOGIN_SUCCESS', user, LoginType.WEB_PHONE, ip, address)

    return token
  }

  async smsLoginThroughMiniProgram(
    phone: string,
    code: string,
    ip: string,
    ua: string,
  ): Promise<LoginToken> {
    await this.checkCode(phone, code)
    await this.userService.smsLoginReg(phone)

    // console.log('[MiniProgram]', phone, code)

    const user = await this.userService.findUserByUserPhone(phone)
    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua, LoginType.WX_MINI_PROGRAM)

    const address = await getIpAddress(ip)
    $event.emit('USER_LOGIN_SUCCESS', user, LoginType.WX_MINI_PROGRAM, ip, address)

    return token
  }

  async feishuLogin(
    code: string,
    ip: string,
    ua: string,
  ): Promise<LoginToken> {
    // const internal: any = await $larkSuite.getAppAccessTokenInternal()

    // if (!internal) {
    //   throw new BusinessException('app_access_token request error')
    // }

    // if (internal.code !== 0) {
    //   throw new BusinessException(`app_access_token request error${internal.msg}`)
    // }

    // const app_access_token = internal.app_access_token || ''

    const auth: any = await $larkSuite.getUserAccessToken(code)

    if (!auth.data) {
      throw new BusinessException('user_access_token request error')
    }

    if (auth.code !== 0) {
      throw new BusinessException(`user_access_token request error${auth.data.msg}`)
    }

    const { name, open_id, mobile } = auth.data

    getLogger().log(`[Auth] [Platform] ${name} login with FeiShu pc client.`)

    // 先根据 +8617748770000 找到手机号
    const phone = mobile.replace('+86', '')
    const user = await this.userService.findUserByUserPhone(phone)
    if (isEmpty(user)) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)
    }

    let thirdParty = await this.entityManager.findOne(ThirdPartyBindingEntity, {
      where: {
        openId: open_id,
        isActive: true,
        provider: 'feishu',
      },
    })

    if (isEmpty(thirdParty)) {
      thirdParty = await this.entityManager.create(ThirdPartyBindingEntity, {
        user,
        openId: open_id,
        provider: 'feishu',
        meta: btoa(encodeURIComponent(JSON.stringify({
          ...auth,
        }))),
      })

      await thirdParty.save()
    }

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua, LoginType.PC_FEISHU)

    const locale = await getIpAddress(ip)
    $event.emit('USER_LOGIN_SUCCESS', user, LoginType.PC_FEISHU, ip, locale)

    return token
  }

  /**
   * 获取微信登录JWT
   */
  async wxLogin(
    code: string,
    ip: string,
    ua: string,
  ): Promise<LoginToken> {
    const status = +(await this.redis.get(`login_${code}`))

    if (status !== CodeStatus.SUCCESS) {
      throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION)
    }

    const uid = await this.redis.get(`info:login_${code}`)

    if (uid === null || !Number.isInteger(+uid)) {
      getLogger().log('error', `user ${uid} login failed. => Platform | Wechat @${code}`)
      throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION)
    }

    getLogger().log(`[Auth] [WechatLogin] Try login with uid ${uid}`)

    const user = await this.userService.findUserById(+uid)
    if (isEmpty(user))
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND)

    await this.redis.set(`login_${code}`, CodeStatus.UNAVAILABLE, 'EX', 1)
    await this.redis.set(`info:login_${code}`, '', 'EX', 1)

    const roleIds = await this.roleService.getRoleIdsByUser(user.id)

    const roles = await this.roleService.getRoleValues(roleIds)

    // 包含access_token和refresh_token
    const token = await this.tokenService.generateAccessToken(user.id, roles)

    await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

    // 设置密码版本号 当密码修改时，版本号+1
    await this.redis.set(genAuthPVKey(user.id), 1)

    // 设置菜单权限
    const permissions = await this.menuService.getPermissions(user.id)
    await this.setPermissionsCache(user.id, permissions)

    await this.loginLogService.create(user.id, ip, ua, LoginType.WEB_WECHAT)

    const address = await getIpAddress(ip)
    $event.emit('USER_LOGIN_SUCCESS', user, LoginType.WEB_WECHAT, ip, address)

    return token
  }

  async renewToken(refresh_token: string) {
    // 先根据 refresh_token 去查询 user_refresh_tokens
    const userRefreshToken = await this.entityManager.findOne(RefreshTokenEntity, {
      where: {
        value: refresh_token,
      },
      relations: {
        accessToken: {
          user: true,
        },
      },
    })

    if (isEmpty(userRefreshToken))
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)

    console.log('user refresh', userRefreshToken.accessToken.user, userRefreshToken)

    return this.tokenService.renewToken(userRefreshToken)
  }

  /**
   * 获取登录JWT
   * 返回null则账号密码有误，不存在该用户
   */
  // async login(
  //   username: string,
  //   password: string,
  //   ip: string,
  //   ua: string,
  // ): Promise<string> {
  //   const user = await this.userService.findUserByUserName(username)
  //   if (isEmpty(user))
  //     throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

  //   const comparePassword = md5(`${password}${user.psalt}`)
  //   if (user.password !== comparePassword)
  //     throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)

  //   const roleIds = await this.roleService.getRoleIdsByUser(user.id)

  //   const roles = await this.roleService.getRoleValues(roleIds)

  //   // 包含access_token和refresh_token
  //   const token = await this.tokenService.generateAccessToken(user.id, roles)

  //   await this.redis.set(genAuthTokenKey(user.id), token.accessToken, 'EX', this.securityConfig.jwtExprire)

  //   // 设置密码版本号 当密码修改时，版本号+1
  //   await this.redis.set(genAuthPVKey(user.id), 1)

  //   // 设置菜单权限
  //   const permissions = await this.menuService.getPermissions(user.id)
  //   await this.setPermissionsCache(user.id, permissions)

  //   await this.loginLogService.create(user.id, ip, ua, LoginType.WEB_AP)

  //   const address = await getIpAddress(ip)
  //   $event.emit('USER_LOGIN_SUCCESS', user, LoginType.WEB_AP, ip, address)

  //   return token.accessToken
  // }

  /**
   * 效验账号密码
   */
  async checkPassword(username: string, password: string) {
    const user = await this.userService.findUserByUserName(username)

    const comparePassword = md5(`${password}${user.psalt}`)
    if (user.password !== comparePassword)
      throw new BusinessException(ErrorEnum.INVALID_USERNAME_PASSWORD)
  }

  async loginLog(uid: number, ip: string, ua: string) {
    await this.loginLogService.create(uid, ip, ua)
  }

  /**
   * 重置密码
   */
  async resetPassword(username: string, password: string) {
    const user = await this.userService.findUserByUserName(username)

    await this.userService.forceUpdatePassword(user.id, password)
  }

  /**
   * 清除登录状态信息
   */
  async clearLoginStatus(user: IAuthUser, accessToken: string): Promise<void> {
    const exp = user.exp ? (user.exp - Date.now() / 1000).toFixed(0) : this.securityConfig.jwtExprire
    await this.redis.set(genTokenBlacklistKey(accessToken), accessToken, 'EX', exp)
    if (this.appConfig.multiDeviceLogin)
      await this.tokenService.removeAccessToken(accessToken)
    else
      await this.userService.forbidden(user.uid, accessToken)
  }

  /**
   * 获取菜单列表
   */
  async getMenus(uid: number) {
    return this.menuService.getMenus(uid)
  }

  /**
   * 获取权限列表
   */
  async getPermissions(uid: number): Promise<string[]> {
    return this.menuService.getPermissions(uid)
  }

  async getPermissionsCache(uid: number): Promise<string[]> {
    const permissionString = await this.redis.get(genAuthPermKey(uid))
    return permissionString ? JSON.parse(permissionString) : []
  }

  async setPermissionsCache(uid: number, permissions: string[]): Promise<void> {
    await this.redis.set(genAuthPermKey(uid), JSON.stringify(permissions))
  }

  async getPasswordVersionByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthPVKey(uid))
  }

  async getTokenByUid(uid: number): Promise<string> {
    return this.redis.get(genAuthTokenKey(uid))
  }
}
