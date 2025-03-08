import * as lark from '@larksuiteoapi/node-sdk'
import Redis from 'ioredis'

import { env } from '~/global/env'
import { GlobalStatusOptions } from '~/modules/auth/auth.controller'

const LarkSuiteOptions = {
  APP_ID: env('FEISHU_APP_ID'),
  APP_SECRET: env('FEISHU_APP_SECRET'),
  CARD_MAIN_TEMPLATE_ID: env('FEISHU_CARD_MAIN_TEMPLATE_ID'),
  MAIN_MESSAGE_GROUP_ID: env('FEISHU_CARD_MAIN_CHAT_ID'),
}

export class LarkSuiteManager {
  #redis: Redis
  #client: lark.Client

  constructor() {
    this.#client = new lark.Client({
      appId: LarkSuiteOptions.APP_ID,
      appSecret: LarkSuiteOptions.APP_SECRET,
    })

    setTimeout(() => {
      // 建立成功时需要向后端发送启动服务
      this.#client.im.message.createByCard({
        params: {
          receive_id_type: 'chat_id',
        },
        data: {
          receive_id: LarkSuiteOptions.MAIN_MESSAGE_GROUP_ID,
          template_id: LarkSuiteOptions.CARD_MAIN_TEMPLATE_ID,
          template_variable: {
            content: `后端系统已于 ${new Date().toLocaleDateString()} 启动成功！系统版本：${GlobalStatusOptions.version} #${GlobalStatusOptions.manualVersion}`,
            title: '系统启动成功',
          },
        },
      })
    }, 200)
  }

  init(redis: Redis,

  ) {
    this.#redis = redis
  }

  get JsApiTicket() {
    return this.#client.verification.v1.verification.get()
  }

  getAppAccessTokenInternal() {
    return this.#client.auth.appAccessToken.internal({
      data: {
        app_id: LarkSuiteOptions.APP_ID,
        app_secret: LarkSuiteOptions.APP_SECRET,
      },

    })
  }

  getAppAccessToken(ticket: string) {
    return this.#client.auth.appAccessToken.create({
      data: {
        app_id: LarkSuiteOptions.APP_ID,
        app_secret: LarkSuiteOptions.APP_SECRET,
        app_ticket: ticket,
      },
    })
  }

  getUserAccessToken(code: string) {
    return this.#client.authen.v1.accessToken.create({
      data: {
        grant_type: 'authorization_code',
        code,
      },
    })
  }
}

export const $larkSuite = new LarkSuiteManager()
