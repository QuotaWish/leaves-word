import Redis from 'ioredis'
import { type InAuthEvent, type InAuthMpEvent, type InBatchJobResult, type InBatchJobResultEvent, type InComponentVerifyTicket, type InEnterAgentEvent, type InExternalContact, type InExternalContactEvent, InFollowEvent, InImageMsg, InLinkMsg, InLocationEvent, InLocationMsg, type InMassEvent, InMenuEvent, InMsg, InNotDefinedMsg, InQrCodeEvent, type InRegisterCorp, InShakearoundUserShakeEvent, InShortVideoMsg, InSpeechRecognitionResults, type InSuiteTicket, type InTaskEvent, InTemplateMsgEvent, InTextMsg, type InUpdatePartyEvent, type InUpdateTagEvent, type InUpdateUserEvent, InVideoMsg, InVoiceMsg, type InWxVerifyDispatchEvent, MsgAdapter, OutImageMsg, OutMsg, OutTextMsg, OutVideoMsg, OutVoiceMsg } from 'tnwx'

import { EntityManager } from 'typeorm'

import { CodeStatus } from '~/modules/platform/platform.dto'

import { ThirdPartyBindingEntity } from '~/modules/platform/platform.entity'

import { $event } from '../eventbus/init'

import { getLogger } from '../interceptors/logging.interceptor'

import { globalWxOptions } from './init'

export class MsgController implements MsgAdapter {
  private redis: Redis
  private entityManager: EntityManager

  initRedis(redis: Redis) {
    this.redis = redis
  }

  initManager(entityManager: EntityManager) {
    this.entityManager = entityManager

    $event.injectBase(entityManager)
  }

  processInWxVerifyDispatchEvent(inWxVerifyDispatchEvent: InWxVerifyDispatchEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInTaskEvent(inTaskEvent: InTaskEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInEnterAgentEvent(inEnterAgentEvent: InEnterAgentEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInBatchJobResultEvent(inBatchJobResultEvent: InBatchJobResultEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInUpdateUserEvent(inUpdateUserEvent: InUpdateUserEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInUpdatePartyEvent(inUpdatePartyEvent: InUpdatePartyEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInUpdateTagEvent(inUpdateTagEvent: InUpdateTagEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInMassEvent(inMassEvent: InMassEvent): Promise<OutMsg> {
    throw new Error('Method not implemented.')
  }

  processInSuiteTicket(inSuiteTicket: InSuiteTicket): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInComponentVerifyTicket(inComponentVerifyTicket: InComponentVerifyTicket): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInAuthEvent(inAuthEvent: InAuthEvent): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInAuthMpEvent(inAuthMpEvent: InAuthMpEvent): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInBatchJobResult(inBatchJobResult: InBatchJobResult): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInExternalContactEvent(inExternalContactEvent: InExternalContactEvent): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInExternalContact(inExternalContact: InExternalContact): Promise<string> {
    throw new Error('Method not implemented.')
  }

  processInRegisterCorp(inRegisterCorp: InRegisterCorp): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async processInTextMsg(inTextMsg: InTextMsg): Promise<OutMsg> {
    const outMsg = new OutTextMsg(inTextMsg)
    // outMsg.setContent(`<a href="https://quotawish.com">立即打开</a>`)
    // let content: string = 'IJPay 让支付触手可及 \n\nhttps://gitee.com/javen205/IJPay'
    // if (inTextMsg.getContent === '极速开发微信公众号') {
    //   content = '极速开发微信公众号 \n\nhttps://github.com/javen205/weixin_guide'
    //   outMsg = new OutTextMsg(inTextMsg)
    //   outMsg.setContent(content)
    // }
    // else if (inTextMsg.getContent === '聚合支付') {
    //   // 最新规则：开发者只能回复1条图文消息；其余场景最多可回复8条图文消息
    //   outMsg = new OutNewsMsg(inTextMsg)
    //   // outMsg.addArticle('聚合支付了解下', 'IJPay 让支付触手可及', 'https://gitee.com/javen205/IJPay/raw/master/assets/img/IJPay-t.png', 'https://gitee.com/javen205/IJPay')
    //   outMsg.addArticle('jfinal-weixin', '极速开发微信公众号', 'https://gitee.com/javen205/IJPay/raw/master/assets/img/IJPay-t.png', 'https://gitee.com/JFinal/jfinal-weixin')
    // }
    // else if (inTextMsg.getContent === '测试') {
    //   outMsg = new OutTextMsg(inTextMsg)
    //   outMsg.setContent(`<a href="https://quotawish.com">立即打开</a>`)
    // }
    // else {
    //   // outMsg = new OutTextMsg(inTextMsg);
    //   // outMsg.setContent(content);
    //   // 转发给多客服PC客户端
    //   outMsg = new OutCustomMsg(inTextMsg)
    //   console.log('转发给多客服PC客户端')
    // }
    return outMsg
  }

  async processInImageMsg(inImageMsg: InImageMsg): Promise<OutMsg> {
    const outMsg = new OutImageMsg(inImageMsg)
    outMsg.setMediaId = inImageMsg.getMediaId
    return outMsg
  }

  async processInVoiceMsg(inVoiceMsg: InVoiceMsg): Promise<OutMsg> {
    const outMsg = new OutVoiceMsg(inVoiceMsg)
    outMsg.setMediaId = inVoiceMsg.getMediaId
    return outMsg
  }

  async processInVideoMsg(inVideoMsg: InVideoMsg): Promise<OutMsg> {
    const outMsg = new OutVideoMsg(inVideoMsg)
    outMsg.setMediaId = inVideoMsg.getMediaId
    outMsg.setDescription = '科塔锐行 | AI改变世界'
    outMsg.setTitle = '视频消息'
    return outMsg
  }

  async processInShortVideoMsg(inShortVideoMsg: InShortVideoMsg): Promise<OutMsg> {
    const outMsg = new OutVideoMsg(inShortVideoMsg)
    outMsg.setMediaId = inShortVideoMsg.getMediaId
    outMsg.setDescription = '科塔锐行 | AI改变世界'
    outMsg.setTitle = '短视频消息'
    return outMsg
  }

  async processInLocationMsg(inLocationMsg: InLocationMsg): Promise<OutMsg> {
    return this.renderOutTextMsg(inLocationMsg, `位置消息... \n\nX:${inLocationMsg.getLocation_X} Y:${inLocationMsg.getLocation_Y}\n\n${inLocationMsg.getLabel}`)
  }

  async processInLinkMsg(inLinkMsg: InLinkMsg): Promise<OutMsg> {
    const text = new OutTextMsg(inLinkMsg)
    text.setContent(`链接频消息...${inLinkMsg.getUrl}`)
    return text
  }

  async processInSpeechRecognitionResults(inSpeechRecognitionResults: InSpeechRecognitionResults): Promise<OutMsg> {
    const text = new OutTextMsg(inSpeechRecognitionResults)
    text.setContent(`语音识别消息...${inSpeechRecognitionResults.getRecognition}`)
    return text
  }

  async processInFollowEvent(inFollowEvent: InFollowEvent): Promise<OutMsg> {
    if (InFollowEvent.EVENT_INFOLLOW_SUBSCRIBE === inFollowEvent.getEvent) {
      return this.renderOutTextMsg(inFollowEvent, '感谢你的关注~ 么么哒 \n\n欢迎您访问我们的网站了解更多：https://ai.quotawish.com')
    }
    else if (InFollowEvent.EVENT_INFOLLOW_UNSUBSCRIBE === inFollowEvent.getEvent) {
      console.error(`取消关注：${inFollowEvent.getFromUserName}`)
      return this.renderOutTextMsg(inFollowEvent)
    }
    else {
      return this.renderOutTextMsg(inFollowEvent)
    }
  }

  async processInQrCodeEvent(inQrCodeEvent: InQrCodeEvent): Promise<OutMsg> {
    const fromUser = inQrCodeEvent.getFromUserName
    let eventKey = inQrCodeEvent.getEventKey
    if (InQrCodeEvent.EVENT_INQRCODE_SUBSCRIBE === inQrCodeEvent.getEvent) {
      eventKey = eventKey.replace('qrscene_', '')
    }

    const type = eventKey.indexOf('_') > 0 ? eventKey.split('_')[0] : eventKey
    if (type === 'login') {
      return await this.handleLogin(eventKey.replace(`${type}_`, ''), fromUser, inQrCodeEvent)
    }

    if (InQrCodeEvent.EVENT_INQRCODE_SUBSCRIBE === inQrCodeEvent.getEvent) {
      console.debug(`扫码未关注：${inQrCodeEvent.getFromUserName}`)
      console.log('e', inQrCodeEvent, inQrCodeEvent.getEventKey)
      return this.renderOutTextMsg(inQrCodeEvent, `感谢您的关注，二维码内容：${inQrCodeEvent.getEventKey}`)
    }
    else if (InQrCodeEvent.EVENT_INQRCODE_SCAN === inQrCodeEvent.getEvent) {
      console.debug(`扫码已关注：${inQrCodeEvent.getFromUserName}`)
      console.log('e', inQrCodeEvent, inQrCodeEvent.getEventKey)
      return this.renderOutTextMsg(inQrCodeEvent)
    }
    else {
      return this.renderOutTextMsg(inQrCodeEvent)
    }
  }

  async processInLocationEvent(inLocationEvent: InLocationEvent): Promise<OutMsg> {
    console.debug(`发送地理位置事件：${inLocationEvent.getFromUserName}`)

    return this.renderOutTextMsg(inLocationEvent, `地理位置是：${inLocationEvent.getLatitude}`)
  }

  async processInMenuEvent(inMenuEvent: InMenuEvent): Promise<OutMsg> {
    console.debug(`菜单事件：${inMenuEvent.getFromUserName}`)

    return this.renderOutTextMsg(inMenuEvent, `菜单事件内容是：${inMenuEvent.getEventKey}`)
  }

  async processInTemplateMsgEvent(inTemplateMsgEvent: InTemplateMsgEvent): Promise<OutMsg> {
    console.debug(`模板消息事件：${inTemplateMsgEvent.getFromUserName} ${inTemplateMsgEvent.getStatus}`)
    return this.renderOutTextMsg(inTemplateMsgEvent, `消息发送状态：${inTemplateMsgEvent.getStatus}`)
  }

  async processInShakearoundUserShakeEvent(inShakearoundUserShakeEvent: InShakearoundUserShakeEvent): Promise<OutMsg> {
    console.debug(`摇一摇事件：${inShakearoundUserShakeEvent.getFromUserName} ${inShakearoundUserShakeEvent.getUuid}`)
    return this.renderOutTextMsg(inShakearoundUserShakeEvent, `uuid：${inShakearoundUserShakeEvent.getUuid}`)
  }

  async processIsNotDefinedMsg(inNotDefinedMsg: InNotDefinedMsg): Promise<OutMsg> {
    return this.renderOutTextMsg(inNotDefinedMsg, '未知消息')
  }

  async renderOutTextMsg(inMsg: InMsg, content?: string): Promise<OutTextMsg> {
    const outMsg = new OutTextMsg(inMsg)
    outMsg.setContent(content || ' ')
    return outMsg
  }

  async handleLogin(query: string, user: string, inQrCodeEvent: InQrCodeEvent) {
    const exist = await this.redis.exists(`login_${query}`)
    if (!exist)
      return this.renderOutTextMsg(inQrCodeEvent, `【科塔锐行科技】暂时还没有登录请求，请刷新网页！`)

    // 获取 query
    const status = await this.redis.get(`login_${query}`)

    if (+status !== CodeStatus.AVAILABLE) {
      getLogger().warn(`扫码状态异常：${query} ${typeof status}(${+status}) - ${user}`)
      return this.renderOutTextMsg(inQrCodeEvent, `【科塔锐行科技】您已登录，请勿重复扫码！`)
    }

    await this.redis.set(`login_${query}`, CodeStatus.SCANNED, 'EX', 120)

    // const res = await this.entityManager.findOne(ThirdPartyBindingEntity, { where: { openId: user, provider: 'wechat' } })
    const res = await this.entityManager.createQueryBuilder(ThirdPartyBindingEntity, 'thirdPartyBinding')
      .leftJoinAndSelect('thirdPartyBinding.user', 'user')
      .where('thirdPartyBinding.openId = :openId', { openId: user })
      .andWhere('thirdPartyBinding.provider = :provider', { provider: 'wechat' })
      .getOne()
    if (res && res.isActive) { // Bind (防止上次流程中断)
      const meta = JSON.parse(decodeURIComponent(atob(res.meta)))

      if (meta) {
        // 判断是否大于30天
        const updatedAt = res.updatedAt.getTime()
        const now = new Date().getTime()
        const diff = now - updatedAt
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (diffDays < 30) {
          console.log('login user', res, JSON.stringify(res))

          // 直接登录
          await this.redis.set(`login_${query}`, CodeStatus.SUCCESS, 'EX', 120)
          await this.redis.set(`info:login_${query}`, res.user.id, 'EX', 120)

          return this.renderOutTextMsg(inQrCodeEvent) // this.renderOutTextMsg(inQrCodeEvent, `【科塔锐行科技】登录成功！`)
        }

        // TODO 暂定这样
        // 超时了 删除平台绑定 要求重新绑定
        await res.remove()
      }
    }

    // 设置相应的参数 => 维持对话有效期 2分钟
    // 由前端扫码进行触发
    await this.redis.set(`info:login_${query}`, user, 'EX', 120)

    const url = buildAuthorizeUrl(globalWxOptions.APP_ID, query)

    return this.renderOutTextMsg(inQrCodeEvent, `【科塔锐行科技】<a href="${url}">点击这里立即登录</a>`)
  }
}

export const msgAdapterController = new MsgController()

function buildAuthorizeUrl(appId: string, state: string) {
  const redirectUrl = `${globalWxOptions.REDIRECT_URL}`

  // const redirectUrl = 'https://api.quotawish.com/api/authorize/wechat/success'
  // const redirectUrl = 'http://wx.tagzxia.com/api/platform/qrcode/auth/wechat'

  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
}
