import { getLogger } from '~/common/interceptors/logging.interceptor'

import { $aiProviderManager, CompletionFormat, IProviderMeta, ITransmissionFormat, ITransmissionRole, ITransmissionStatus, ProviderChat, StatusUpdateFormat, SuggestFormat, ToolFormat, VerboseFormat } from './BaseProvider'
import { QuotaModel } from './types'

export class VolcEngineProvider implements IProviderMeta {
  model: QuotaModel
  create(chat_id: string, signal: AbortSignal) {
    return new VolcEngineChat(chat_id, signal, this)
  }
}

const options = {
  token: 'pat_JabnjgbuaWVcd3dOrVQerqWIxAAnpgoqWdTyvP5xBUITHussfsYmcCEaApt2UpQr',
  // workflow_id: '7415872181475688489',
  bot_id: '7415882247431290917',
}

// normal
export class VolcEngineChat extends ProviderChat {
  provider: VolcEngineProvider

  getProviderName(): string {
    return 'QuotaVE'
  }

  getPromptRate(): number {
    return 1.125
  }

  getCompletionRate(): number {
    return 1.025
  }

  calcPromptPrice(tokens: number): number {
    return (tokens / 1000000) * 2.5
  }

  calcCompletionPrice(tokens: number): number {
    return (tokens / 1000000) * 10
  }

  constructor(chat_id: string, signal: AbortSignal, provider: VolcEngineProvider) {
    super(chat_id, signal)

    this.provider = provider
  }

  async convertHistoryToAdditional() {
    const chatMessages = this.getChatMessages()

    const history: any[] = []

    // if (this.getTemplate()) {
    //   const contentList = []

    //   contentList.push({
    //     type: 'text',
    //     text: `从现在开始你需要扮演角色，相关信息如下，无论何时都不要忘记this.getTemplate()`,
    //   })

    //   history.push({
    //     role: 'user',
    //     type: 'question',
    //     content: JSON.stringify(contentList),
    //     content_type: 'object_string',
    //   })
    // }

    for (const message of chatMessages) {
      const contentList = []
      const contents = message.content

      for (const content of contents) {
        const { type, value } = content

        // error和tool直接过滤掉 不影响对话功能（因为文本内容已经根据tool总结过 error是异常消息 排除）
        if (type === 'error' || type === 'tool')
          continue
        if (type === 'card') {
          getLogger().warn(`[VolcEngineProvider] Unsupported content type: ${type}`)

          continue
        }

        if (type === 'text' || type === 'markdown') {
          contentList.push({
            type: 'text',
            text: value,
          })
        }
        else if (type === 'file' || type === 'image') {
          contentList.push({
            type,
            file_url: value,
          })

          contentList.push({
            type: 'text',
            text: '',
          })
        }
      }

      history.push({
        role: message.role,
        // type: message.role !== 'assistant' ? 'question' : 'answer',
        content: JSON.stringify(contentList),
        content_type: 'object_string',
      })
    }

    return history
  }

  async getBody() {
    if (this.provider.model === QuotaModel.QUOTA_THIS_TITLE) {
      this.getOptions().maxTokens = 12

      return JSON.stringify({
        bot_id: '7420840022708518966',
        user_id: '123456789', // TODO: 暂时用同一个
        additional_messages: (await this.convertHistoryToAdditional()),
        stream: true,
        // auto_save_history: true, // TODO
        // TODO: meta
      })
    }

    const variable = this.getVariable()
    const template = this.getTemplate()

    if (this.provider.model === QuotaModel.QUOTA_THIS_NORMAL_TURBO) {
      return JSON.stringify({
        bot_id: '7421070880136757263',
        user_id: variable.uid,
        additional_messages: (await this.convertHistoryToAdditional()),
        stream: true,
        auto_save_history: true, // TODO
        // TODO: meta
        custom_variables: {
          name: variable.name,
          // phone: variable.phone,
          email: variable.email,
          avatar: variable.avatar,
          ua: variable.ua,
          ip: variable.ip,
          ...(template ? { template } : {}),
        },
      })
    }

    return JSON.stringify({
      bot_id: '7415882247431290917',
      user_id: variable.uid,
      additional_messages: (await this.convertHistoryToAdditional()),
      stream: true,
      auto_save_history: true, // TODO
      // TODO: meta
      custom_variables: {
        name: variable.name,
        // phone: variable.phone,
        email: variable.email,
        avatar: variable.avatar,
        ua: variable.ua,
        ip: variable.ip,
        ...(template ? { template } : {}),
      },
    })
  }

  async _startCompletion(handler: (format: ITransmissionFormat) => void, onErr: (e: any, data: any) => void) {
    const sessionId = this.getSessionId()

    const body = await this.getBody()

    console.log('body', body)

    const res = await fetch('https://api.coze.cn/v3/chat', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pat_3svMtFTnmKPDay3DNINgDwcmbgwtuhDcNrXGx1grhUrKfadm71xEXRkgwM67ay2y',
        'Accept': 'text/event-stream',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
      },
      body,
      signal: this.getSignal(),
    })

    const reader = res.body.getReader()

    const decoder = new TextDecoder()

    // const reader = res.pipeThrough(new TextDecoderStream()).getReader()
    // const arr = []

    while (true) {
      const { done, value } = await reader.read()
      const _value = decoder.decode(value)
      if (done) {
        handler(new StatusUpdateFormat(ITransmissionStatus.END, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))

        break
      }

      const regex = /event:(.*?)\ndata:(\{.*?\})(?:\n{2,}|$)/gs
      const matches = _value.matchAll(regex)
      // if (!match) {
      //   console.error('Invalid format', _value)
      //   continue
      // }

      for (const match of matches) {
        const [, event, dataValue] = match

        // arr.push({ done, event, dataValue, _value })

        // console.log('---', { done, event, dataValue, _value })

        const data = JSON.parse(dataValue)

        const { status, type, content, code } = data

        if (code === 4100) {
          if (code === 4100) {
            onErr(new Error('ERROR ON AUTHENTICATION'), data)
          }
        }

        if (status) {
          if (type === 'knowledge') {
            console.log('knowledge', content, data)
          }

          // status update
          const mappedStatus = mapStatusName(status)
          if (mappedStatus) {
            if (mappedStatus === ITransmissionStatus.FAILED) {
              const _headers: Record<string, string> = {}

              for (const [key, value] of res.headers.entries()) {
                _headers[key] = value
              }

              onErr(new Error(data.msg), {
                ...res.headers,
                log_id: res.headers.get('X-Tt-Logid'),
                headers: _headers,
              })
            }
            handler(new StatusUpdateFormat(mappedStatus, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))
          }
        }
        else if (type === 'knowledge') {
          console.log('knowledge', content)

          handler(
            new ToolFormat(ITransmissionStatus.CALLING, 'Knowledge', content, 'END', sessionId, ITransmissionRole.TOOL, this.getChatId()),
          )
        }
        else if (type === 'function_call') {
          handler(
            new ToolFormat(ITransmissionStatus.CALLING, 'Quota_VE_Tool', content, 'START', sessionId, ITransmissionRole.TOOL, this.getChatId()),
          )
        }
        else if (type === 'tool_response' || type === 'tool_output') {
          handler(
            new ToolFormat(ITransmissionStatus.RESULT, 'Quota_VE_Tool', content, 'END', sessionId, ITransmissionRole.TOOL, this.getChatId()),
          )
        }
        else if (type === 'answer') {
          handler(
            new CompletionFormat('QuotaVE', content, sessionId, ITransmissionRole.ASSISTANT, this.getChatId(), event.includes('conversation.message.completed')),
          )
        }
        else if (type === 'follow_up') {
          handler(
            new SuggestFormat(data.content_type, content, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()),
          )
        }
        else if (type === 'verbose') {
          const content = data.content

          let name: string
          let forwardData = content

          try {
            const obj = JSON.parse(content)

            name = obj.msg_type
            forwardData = obj.data
          }
          catch (_ignored) {

          }

          handler(
            new VerboseFormat(name || 'unknown', forwardData, sessionId, ITransmissionRole.ASSISTANT, this.getChatId(), content),
          )
        }
        else {
          console.warn('Unknown type', type, data)
        }
      }
    }

    // const targetFile = path.join(__dirname, '..', '..', '..', '..', `${Date.now()}.json`)

    // await fs.writeFileSync(targetFile, JSON.stringify(arr))

    // console.log('file', targetFile)

    return true
  }
}

function mapStatusName(name: string) {
  switch (name) {
    case 'created':
      return ITransmissionStatus.START
    case 'in_progress':
      return ITransmissionStatus.PROGRESS
    case 'verbose':
      return ITransmissionStatus.VERBOSE
    // case 'delta':
    //   return ITransmissionStatus.PROGRESS
    case 'completed':
      return ITransmissionStatus.END
    case 'failed':
      return ITransmissionStatus.FAILED
    case 'requires_action':
      return ITransmissionStatus.CALLING
  }

  console.warn('Unknown status', name)

  return null
}

$aiProviderManager.registerProvider(QuotaModel.QUOTA_THIS_NORMAL, new VolcEngineProvider())
$aiProviderManager.registerProvider(QuotaModel.QUOTA_THIS_TITLE, new VolcEngineProvider())
$aiProviderManager.registerProvider(QuotaModel.QUOTA_THIS_NORMAL_TURBO, new VolcEngineProvider())
$aiProviderManager.registerProvider('volc-doubao-pro-256k', new VolcEngineProvider())
