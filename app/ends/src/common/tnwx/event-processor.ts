import dayjs from 'dayjs'
import { TemplateApi, TemplateData } from 'tnwx'

import { env } from '~/global/env'

import { ThirdPartyBindingEntity } from '~/modules/platform/platform.entity'

import { $event } from '../eventbus/init'
import { getLogger } from '../interceptors/logging.interceptor'

const WX_TEMPLATE_LOGIN_SUCCESS = env('WX_TEMPLATE_LOGIN_SUCCESS')

export default () => {
  $event.on('USER_LOGIN_SUCCESS', async (user, loginType, ip, address) => {
    const res = await $event.entityManager.createQueryBuilder(ThirdPartyBindingEntity, 'thirdPartyBinding')
      .leftJoinAndSelect('thirdPartyBinding.user', 'user')
      .where('thirdPartyBinding.user_id = :user_id', {
        user_id: user.id,

      })
      .andWhere('thirdPartyBinding.provider = :provider', { provider: 'wechat' })
      .getOne()
    if (!res) {
      getLogger().log(`[UserLogin] 用户未绑定微信，模板消息取消推送。 | user: ${JSON.stringify(user)} `)

      return
    }

    // format date
    const date = new Date()
    const format = 'YYYY年MM月DD日 HH:mm'

    const loginTypeMapper = {
      WEB_WECHAT: '微信登录',
      WEB_AP: '账号密码登录',
      WEB_PHONE: '手机号登录',
      PC_FEISHU: '飞书PC客户端登录',
      WECHAT_MINI_PROGRAM: '微信小程序登录',
    }

    const templateJson = new TemplateData().New()
      .setToUser(res.openId)
      .setTemplateId(WX_TEMPLATE_LOGIN_SUCCESS)
      .setTemplateUrl('https://ai.quotawish.com/?data=history')
      .add('time4', dayjs(date).format(format), '')
      .add('phrase12', '登录成功', '')
      .add('thing10', user.nickname, '')
      .add('thing11', loginTypeMapper[loginType], '')
      .add('thing5', address, '')
      .build()

    // Object.keys(templateJson.data).forEach((key) => delete templateJson.data[key].color)

    console.log('[UserLogin] Push template', templateJson)
    const result = await TemplateApi.send(templateJson)

    getLogger().log('[UserLogin] 模板消息推送结果：', result)
  })
}
