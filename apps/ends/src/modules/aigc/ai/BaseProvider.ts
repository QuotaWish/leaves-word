import { encode } from 'gpt-3-encoder'

import type { Subscriber } from 'rxjs'

import { getLogger } from '~/common/interceptors/logging.interceptor'
import { generateUUID } from '~/utils'

import type { IMessageItem } from '../aigc.dto'

import { LLMModel } from './types'

export enum IFormatType {
  TEXT = 'text',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  FILE = 'file',
  CUSTOM = 'custom',
}

export enum IFormatEvent {
  ERROR = 'error',
  SUGGEST = 'suggest',
  VERBOSE = 'verbose',
  HEAR_BEAT = 'heartbeat',
  COMPLETION = 'completion',
  STATUS_UPDATED = 'status_updated',
}

/**
 * 用户提交对话后，先由服务器管控
 * 1. 对话开始、处理中、调用工具、工具返回、结束
 * 2. 对话结束、对话错误、对话取消
 */
export enum ITransmissionStatus {
  START = 'start',
  PROGRESS = 'progress',
  CALLING = 'calling',
  RESULT = 'result',
  VERBOSE = 'verbose',

  END = 'end',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum ITransmissionRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool',
  TOOL_RESULT = 'tool_result',
}

export interface IModelOptions {
  temperature: number
  maxTokens: number
}

export interface ITransmissionFormat {
  id: string // 单聊天ID
  role: ITransmissionRole
  event: IFormatEvent
  chat_id: string // 对话ID
}

export class TransmissionFormat implements ITransmissionFormat {
  id: string
  role: ITransmissionRole
  event: IFormatEvent
  chat_id: string

  constructor(id: string, role: ITransmissionRole, event: IFormatEvent, chat_id: string) {
    this.id = id
    this.role = role
    this.event = event
    this.chat_id = chat_id
  }
}

export interface IStatusUpdateFormat extends ITransmissionFormat {
  status: ITransmissionStatus
}

export class StatusUpdateFormat extends TransmissionFormat implements IStatusUpdateFormat {
  status: ITransmissionStatus

  constructor(status: ITransmissionStatus, id: string, role: ITransmissionRole, chat_id: string) {
    super(id, role, IFormatEvent.STATUS_UPDATED, chat_id)
    this.status = status
  }
}

export interface ICompletionFormat extends ITransmissionFormat {
  name: string
  content: string
}

export class CompletionFormat extends TransmissionFormat implements ICompletionFormat {
  name: string
  content: string
  completed: boolean

  constructor(name: string, content: string, id: string, role: ITransmissionRole, chat_id: string, completed: boolean = false) {
    super(id, role, IFormatEvent.COMPLETION, chat_id)
    this.name = name
    this.content = content
    this.completed = completed
  }
}

export interface ISuggestFormat extends ITransmissionFormat {
  content_type: string
  content: string
}

export class SuggestFormat extends TransmissionFormat implements ISuggestFormat {
  content_type: string
  content: string

  constructor(content_type: string, content: string, id: string, role: ITransmissionRole, chat_id: string) {
    super(id, role, IFormatEvent.SUGGEST, chat_id)

    this.content_type = content_type
    this.content = content
  }
}

export interface IVerboseFormat extends ITransmissionFormat {
  name: string
  data: string
  addon: string
}

export class VerboseFormat extends TransmissionFormat implements IVerboseFormat {
  name: string
  data: string
  addon: string

  constructor(name: string, data: string, id: string, role: ITransmissionRole, chat_id: string, addon: string) {
    super(id, role, IFormatEvent.VERBOSE, chat_id)

    this.name = name
    this.data = data
    this.addon = addon
  }
}

export interface IToolFormat extends ITransmissionFormat {
  name: string
  data: string
  type: 'START' | 'END'
}

export class ToolFormat extends StatusUpdateFormat implements IToolFormat {
  name: string
  data: string
  type: 'START' | 'END'

  constructor(status: ITransmissionStatus, name: string, data: string, type: 'START' | 'END', id: string, role: ITransmissionRole, chat_id: string) {
    super(status, id, role, chat_id)

    this.name = name
    this.data = data
    this.type = type
  }
}

export interface IErrorFormat extends IStatusUpdateFormat {
  type: 'ERROR' | 'CANCELLED'
  message: string
  timestamp: number
}

export class ErrorFormat extends StatusUpdateFormat implements IErrorFormat {
  type: 'ERROR' | 'CANCELLED'
  message: string
  timestamp: number

  constructor(status: ITransmissionStatus, type: 'ERROR' | 'CANCELLED', message: string, id: string, role: ITransmissionRole, chat_id: string) {
    super(status, id, role, chat_id)

    this.event = IFormatEvent.ERROR

    this.type = type
    this.message = message
  }
}

export interface IHeartBeatFormat extends ITransmissionFormat {
  timestamp: number
}

export class HeartBeatFormat extends TransmissionFormat implements IHeartBeatFormat {
  timestamp: number

  constructor(id: string, role: ITransmissionRole, chat_id: string) {
    super(id, role, IFormatEvent.HEAR_BEAT, chat_id)

    this.timestamp = Date.now()
  }
}

export interface IProviderMeta {
  model: LLMModel
  create: (chat_id: string, signal: AbortSignal) => ProviderChat
}

export interface IChatCompletionOptions {
  handleLog: (info: { meta: { startTime: Date }, price: { prompt: number, completion: number }, tokens: { prompt: number, completion: number } }) => void
  complete: () => void
}

export interface IUserVariable {
  // encoded
  uid: string
  name: string
  avatar?: string
  email?: string
  phone?: string
  gender?: string
  ip?: string
  ua?: string
  age?: number
  params?: {
    latitude: string
    longitude: string
  }
}

export interface IProviderChat {
  useOptions: (options: IModelOptions) => void
  getOptions: () => IModelOptions
  useVariable: (variable: IUserVariable) => void
  getVariable: () => IUserVariable
  useTemplate: (template: string) => void
  getTemplate: () => string
  useChatMessages: (messages: IMessageItem[]) => void
  getChatMessages: () => IMessageItem[]

  startCompletion: (options: IChatCompletionOptions, handler: (format: ITransmissionFormat) => void) => Promise<boolean>

  getPromptRate: () => number
  getCompletionRate: () => number

  calcPromptPrice: (tokens: number) => number
  calcCompletionPrice: (tokens: number) => number

  getStatus: () => ITransmissionStatus
  setStatus: (status: ITransmissionStatus) => void

  getChatId: () => string
  getSignal: () => AbortSignal

  processObservable: (ob: Subscriber<string>, options: IChatCompletionOptions) => void
}

export abstract class ProviderChat implements IProviderChat {
  #status: ITransmissionStatus
  #templateContent: string = ''
  #messages: IMessageItem[]
  #options: IModelOptions
  #variable: IUserVariable
  #sessionId: string = generateUUID()

  #chat_id: string
  #signal: AbortSignal

  getChatId() {
    return this.#chat_id
  }

  getSignal() {
    return this.#signal
  }

  constructor(chat_id: string, signal: AbortSignal) {
    this.#chat_id = chat_id
    this.#signal = signal
  }

  getSessionId() {
    return this.#sessionId
  }

  getStatus() {
    return this.#status
  }

  setStatus(status: ITransmissionStatus) {
    this.#status = status
  }

  useOptions(options: IModelOptions) {
    this.#options = options
  }

  getOptions() {
    return this.#options
  }

  useVariable(variable: IUserVariable) {
    this.#variable = variable
  }

  getVariable() {
    return this.#variable
  }

  useTemplate(template: string) {
    this.#templateContent = template
  }

  getTemplate() {
    return this.#templateContent
  }

  useChatMessages(messages: IMessageItem[]) {
    this.#messages = messages
  }

  getChatMessages() {
    return this.#messages
  }

  abstract _startCompletion(handler: (format: ITransmissionFormat) => void, onErr: (err: Error, meta?: any) => void): Promise<boolean>

  async calculateHistoryTokens() {
    const messages = this.#messages

    let promptLen = 0

    messages.forEach((msg) => {
      msg.content.forEach((item) => {
        if (item.type === 'text' || item.type === 'markdown') {
          promptLen += (encode(item.value.toString()).length || 0)
        }
        else {
          console.warn('Unknown message type', item)

          promptLen += (encode(item.value.toString()).length || 0)
          promptLen += 2048
        }
      })
    })

    promptLen += (encode(this.#templateContent).length || 0)

    return promptLen
  }

  #startTime: Date

  async startCompletion(options: IChatCompletionOptions & { handleError: (e: any) => void }, handler: (format: ITransmissionFormat) => void) {
    if (!this.#options)
      throw new Error('Options not set')

    if (!this.#messages)
      throw new Error('HistoryMessages not set')

    let completionContent = ''

    const result = await this._startCompletion((format: ITransmissionFormat) => {
      if (format instanceof CompletionFormat) {
        completionContent += format.content
      }

      handler(format)
    }, options.handleError)

    if (!result)
      return false

    const promptTokens = (await this.calculateHistoryTokens()) * this.getPromptRate()
    const completionTokens = (encode(completionContent).length || 0) * this.getCompletionRate()

    const promptPrice = this.calcPromptPrice(promptTokens)
    const completionPrice = this.calcCompletionPrice(completionTokens)

    options.handleLog({
      meta: {
        startTime: this.#startTime,
      },
      price: {
        prompt: promptPrice,
        completion: completionPrice,
      },
      tokens: {
        prompt: promptTokens,
        completion: completionTokens,
      },
    })

    options.complete()

    return true
  }

  abstract getPromptRate(): number
  abstract getCompletionRate(): number
  abstract calcPromptPrice(tokens: number): number
  abstract calcCompletionPrice(tokens: number): number

  abstract getProviderName(): string

  processObservable(subscriber: Subscriber<string>, options: IChatCompletionOptions) {
    const lastSent = -1

    const internalController = new AbortController()
    this.#startTime = new Date()
    const startTime = this.#startTime.getTime()

    function _transmissionData(data: ITransmissionFormat, provider: string) {
      const obj = {
        ...data,
        meta: {
          role: data.role,
          chat_id: data.chat_id,
        },
        provider,
      }

      delete obj.role
      delete obj.chat_id

      subscriber.next(JSON.stringify(obj))
    }

    const transmissionData = (data: ITransmissionFormat) => {
      _transmissionData(data, this.getProviderName())
    }

    const complete = async () => {
      subscriber.complete()

      options.complete()
    }

    internalController.signal.onabort = () => {
      getLogger().log(`[Execute AIGC] Abort signal (Internal)`)

      complete()
    }

    const sendHeartPack = () => {
      if (subscriber.closed || internalController.signal.aborted)
        return

      if (Date.now() - lastSent >= 1000 * 3)
        transmissionData(new HeartBeatFormat(this.#sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))

      if (Date.now() - startTime >= 1000 * 60 * 3) {
        transmissionData(new ErrorFormat(ITransmissionStatus.CANCELLED, 'CANCELLED', 'Timeout', this.#sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))

        internalController.abort()
        return
      }

      setTimeout(sendHeartPack, 5000)
    }

    sendHeartPack()

    this.startCompletion({
      complete,
      handleLog: options.handleLog,
      handleError: (e: any, meta?: any) => {
        if (meta)
          console.log('ErrorMeta:', JSON.stringify(meta), meta)
        getLogger().error(`[Execute AIGC] Error: ${e.message}`)

        transmissionData(new ErrorFormat(ITransmissionStatus.FAILED, 'ERROR', e.message, this.#sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))

        internalController.abort()
      },
    }, (format) => {
      transmissionData(format)
    })
  }
}

export interface IAIProviderManager {
  registerProvider: (model: LLMModel, provider: IProviderMeta) => void
  getProviderMeta: (model: LLMModel) => IProviderMeta | null
  createChat: (model: LLMModel, chat_id: string, signal: AbortSignal) => Promise<IProviderChat>
}

export class AIProviderManager implements IAIProviderManager {
  #providerMap = new Map<LLMModel, IProviderMeta>()

  registerProvider(model: LLMModel, provider: IProviderMeta) {
    if (this.#providerMap.has(model))
      throw new Error(`Provider ${model} already registered`)

    provider.model = model
    this.#providerMap.set(model, provider)
  }

  getProviderMeta(model: LLMModel) {
    return this.#providerMap.get(model) || null
  }

  async createChat(model: LLMModel, chat_id: string, signal: AbortSignal) {
    const provider = this.getProviderMeta(model)
    if (!provider)
      throw new Error(`Provider ${model} not found`)

    return provider.create(chat_id, signal)
  }
}

export const $aiProviderManager = new AIProviderManager()
