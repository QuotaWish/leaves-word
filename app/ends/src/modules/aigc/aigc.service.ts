import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'

import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import dayjs from 'dayjs'
import Redis from 'ioredis'
import { isEmpty } from 'lodash'
import { Observable } from 'rxjs'

import { EntityManager, Like, Repository } from 'typeorm'

import { $esClient } from '~/common/elasticsearch'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { getLogger } from '~/common/interceptors/logging.interceptor'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'

import { encodeText } from '~/utils'

import { UserEntity } from '../user/user.entity'

import { $aiProviderManager } from './ai'
import { QuotaModel } from './ai/types'
import { ChatCompletionDto, ChatLogQueryDto, ChatMessageDto, ChatMessageQueryDto, PromptAuditDto, PromptQueryDto, PromptSearchDto, PromptStatus, PromptTagDto, PromptTagQueryDto } from './aigc.dto'
import { ChatMessage, ChatMsgLogEntity, ChatMsgStatus, ChatMsgType, ChatShareMessage, PromptAuditEntity, PromptEntity, PromptTagEntity, PromptUsageEntity } from './aigc.entity'

const INDEX_NAME = 'prompts'

@Injectable()
export class AiGcService {
  incrAsync: (key: string) => Promise<number>
  expireAsync: (key: string, time: number) => Promise<void>

  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepository: Repository<ChatMessage>,
    @InjectRepository(ChatMsgLogEntity)
    private readonly msgLogRepository: Repository<ChatMsgLogEntity>,
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
    @InjectRepository(PromptAuditEntity)
    private readonly promptAuditRepository: Repository<PromptAuditEntity>,
    @InjectRepository(PromptTagEntity)
    private readonly promptTagRepository: Repository<PromptTagEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRedis() private redis: Redis,
  ) {
    this.incrAsync = promisify(this.redis.incr).bind(this.redis)
    this.expireAsync = promisify(this.redis.expire).bind(this.redis)

    this.createIndex()
  }

  async conversationLimit(ip: string, user_id: string) {
    const LIMIT_TIME = 100

    // ip限制
    const ipLimit = await this.redis.get(`conversation:ip:${ip}:send:limit`)
    if (+ipLimit >= 20 * 3)
      throw new BusinessException(ErrorEnum.TOO_MANY_REQUESTS)

    // 3分钟最多发送20条
    const limit = await this.redis.get(`conversation:${user_id}:send:limit`)
    if (+limit >= 20)
      throw new BusinessException(ErrorEnum.TOO_MANY_REQUESTS)

    // 1天一个用户最多发送100条
    let limitCountOfDay: string | number = await this.redis.get(
      `conversation:${user_id}:limit-day`,
    )
    limitCountOfDay = limitCountOfDay ? Number(limitCountOfDay) : 0
    if (limitCountOfDay > LIMIT_TIME) {
      throw new BusinessException(
        ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY,
      )
    }

    // 1天一个ip最多发送300条
    let ipLimitCountOfDay: string | number = await this.redis.get(
      `conversation:ip:${ip}:send:limit-day`,
    )
    ipLimitCountOfDay = ipLimitCountOfDay ? Number(ipLimitCountOfDay) : 0
    if (ipLimitCountOfDay > LIMIT_TIME * 3) {
      throw new BusinessException(
        ErrorEnum.MAXIMUM_FIVE_VERIFICATION_CODES_PER_DAY,
      )
    }
  }

  async log(user_id: string, ip: string) {
    const getRemainTime = () => {
      const now = dayjs()
      return now.endOf('day').diff(now, 'second')
    }

    const limitCountOfDay = await this.redis.get(`conversation:${user_id}:limit-day`)
    const ipLimitCountOfDay = await this.redis.get(`conversation:ip:${ip}:send:limit-day`)

    const ipCount = await this.incrAsync(`conversation:ip:${ip}:send:limit`)
    if (ipCount === 1) {
      await this.expireAsync(`conversation:ip:${ip}:send:limit`, 180)
    }

    const userCount = await this.incrAsync(`conversation:${user_id}:send:limit`)
    if (userCount === 1) {
      await this.expireAsync(`conversation:${user_id}:send:limit`, 180)
    }

    await this.redis.set(
      `conversation:${user_id}:send:limit-count-day`,
      limitCountOfDay,
      'EX',
      getRemainTime(),
    )
    await this.redis.set(
      `conversation:ip:${ip}:send:limit-count-day`,
      ipLimitCountOfDay,
      'EX',
      getRemainTime(),
    )
  }

  async logMsg(data: {
    userId?: number // 可选的用户ID
    messageType: ChatMsgType // 消息类型
    model: string // 使用的模型
    duration: number // 用时（时间戳差，单位为毫秒）
    isStream: boolean // 是否为流式
    promptTokens: number // 提示消耗的tokens
    completionTokens: number // 补全消耗的tokens
    cost: number // 消费金额
    status: ChatMsgStatus // 消息状态
    description?: string // 说明
    userIp?: string // 用户IP地址
    deviceInfo?: string // 用户设备信息
    sessionId?: string // 会话ID
  }): Promise<void> {
    // 第一步：解构数据
    const {
      userId,
      messageType,
      model,
      duration,
      isStream,
      promptTokens,
      completionTokens,
      cost,
      status,
      description,
      userIp,
      deviceInfo,
      sessionId,
    } = data

    // 第二步：整理出有效的参数，并删除无效的
    const params: any = {
      user: userId ? { id: userId } : null, // 关联用户（如果有）
      message_type: messageType,
      model,
      duration,
      is_stream: isStream,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      cost,
      status,
      description: description || null, // 如果没有说明，则设置为 null
      user_ip: userIp || null, // 如果没有用户IP，则设置为 null
      device_info: deviceInfo || null, // 如果没有设备信息，则设置为 null
      session_id: sessionId || null, // 如果没有会话ID，则设置为 null
    }

    // 第三步：存入数据库
    await this.msgLogRepository.save(params)
  }

  /**
   * 创建对话
   */
  async create(user_id: number, { chat_id, topic, value }: ChatMessageDto): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const cm = manager.create(ChatMessage, {
        chat_id,
        topic,
        value,
        user_id,
      })

      const result = await manager.save(cm)
      return result
    })
  }

  /**
   * 更新对话
   */
  async update(id: number, { topic, value }: Partial<ChatMessage>): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const cm = await manager.update(ChatMessage, id, {
        topic,
        value,
      })

      return cm
    })
  }

  /**
   * 删除对话
   */
  async delete(user_id: number, chat_id: string): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const cm = await manager.delete(ChatMessage, {
        chat_id,
        user_id,
      })

      return cm
    })
  }

  /**
   * 获得指定uid的对话
   */
  async get(user_id: number, chat_id: string): Promise<ChatMessage> {
    return this.chatRepository.findOneBy({
      chat_id,
      user_id,
    })
  }

  /**
   * 获取对话数量
   */
  async count(id: number): Promise<number> {
    return this.chatRepository.count({
      where: {
        user_id: id,
      },
    })
  }

  /**
   * 查询对话列表
   */
  async list(user_id: number, {
    page,
    pageSize,
    topic,
  }: ChatMessageQueryDto): Promise<Pagination<ChatMessage>> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat_message')
      // .leftJoinAndSelect('chat_message.user', 'user')
      .where({
        ...(user_id ? { user_id } : null),
        ...(topic ? { topic: Like(`%${topic}%`) } : null),
      })
      .orderBy('chat_message.updated_at', 'DESC')

    return paginate<ChatMessage>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 查询对话列表 （不包含内容）
   */
  async conversationList(user_id: number, {
    page,
    pageSize,
    topic,
  }: ChatMessageQueryDto): Promise<Pagination<ChatMessage>> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat_message')
      .select([
        'chat_message.id',
        'chat_message.chat_id',
        'chat_message.topic',
        'chat_message.updatedAt',
      ])
      // .leftJoinAndSelect('chat_message.user', 'user')
      .where({
        ...(user_id ? { user_id } : null),
        ...(topic ? { topic: Like(`%${topic}%`) } : null),
      })
      .orderBy('chat_message.updatedAt', 'DESC')

    return paginate<ChatMessage>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获取某个对话的详细信息
   */
  async getConversationDetail(user_id: number, chat_id: string): Promise<ChatMessage> {
    return this.chatRepository.findOne({
      where: {
        user_id,
        chat_id,
      },
    })
  }

  /**
   * 查询流量日志列表
   */
  async chatLogList({
    page,
    pageSize,
    message_type,
    model,
    status,
  }: ChatLogQueryDto): Promise<Pagination<ChatMsgLogEntity>> {
    const queryBuilder = this.msgLogRepository
      .createQueryBuilder('chat_messages_log')
      .leftJoinAndSelect('chat_messages_log.user', 'user')
      .where({
        ...(message_type ? { message_type } : null),
        ...(status ? { status } : null),
        ...(model ? { model: Like(`%${model}%`) } : null),
      })
      .orderBy('chat_messages_log.updated_at', 'DESC')

    return paginate<ChatMsgLogEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  /**
   * 获得对话日志的统计信息
   */
  async getStatistics(startDate: Date, endDate: Date, userId?: number) {
    const query = this.msgLogRepository.createQueryBuilder('log')
      .select('log.message_type')
      .addSelect('log.model')
      .addSelect('AVG(log.duration)', 'average_duration')
      .addSelect('SUM(log.prompt_tokens)', 'total_prompt_tokens')
      .addSelect('SUM(log.completion_tokens)', 'total_completion_tokens')
      .addSelect('SUM(log.cost)', 'total_cost')
      .where('log.updated_at BETWEEN :start AND :end', { start: startDate, end: endDate })

    if (userId) {
      query.andWhere('log.user_id = :userId', { userId })
    }

    query.groupBy('log.message_type')
      .addGroupBy('log.model')

    const results = await query.getRawMany()
    return results
  }

  async getConsumptionStatistics(startDate: Date, endDate: Date) {
    const timeDiff = endDate.getTime() - startDate.getTime()
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600))
    const minutesDiff = Math.floor(timeDiff / (1000 * 60))

    // Log the current time range and unit
    let timeUnit: string
    if (daysDiff > 365) {
      timeUnit = '年'
    }
    else if (daysDiff > 30) {
      timeUnit = '月'
    }
    else if (daysDiff > 1) {
      timeUnit = '天'
    }
    else if (hoursDiff > 1) {
      timeUnit = '小时'
    }
    else if (minutesDiff > 1) {
      timeUnit = '分钟'
    }
    else {
      throw new BusinessException('时间范围必须大于一分钟')
    }

    console.log(`当前时间范围: ${startDate.toISOString()} - ${endDate.toISOString()} 时间跨度单位是: ${timeUnit}`)

    const results = await this.msgLogRepository.createQueryBuilder('log')
      .select('log.model')
      .addSelect('DATE_FORMAT(log.updated_at, \'%Y-%m-%d\')', 'date') // Group by day
      .addSelect('SUM(log.prompt_tokens)', 'total_prompt_tokens')
      .addSelect('SUM(log.completion_tokens)', 'total_completion_tokens')
      .addSelect('SUM(log.prompt_tokens + log.completion_tokens)', 'total_tokens')
      .addSelect('SUM(log.cost)', 'total_cost')
      .addSelect('COUNT(*)', 'usage_count')
      .where('log.updated_at BETWEEN :start AND :end', { start: startDate, end: endDate })
      .groupBy('log.model')
      .addGroupBy('date') // Group by both model and date
      .orderBy('date', 'ASC')
      .getRawMany()

    // Format the results into the desired structure
    const modelsData = {}
    const formattedResults = []

    results.forEach((result) => {
      const model = result.log_model
      const date = result.date

      if (!modelsData[model]) {
        modelsData[model] = []
      }

      const entry = {
        date, // Ensure date is included
        total_prompt_tokens: Number.parseInt(result.total_prompt_tokens),
        total_completion_tokens: Number.parseInt(result.total_completion_tokens),
        total_tokens: Number.parseInt(result.total_tokens),
        total_cost: Number.parseFloat(result.total_cost),
        usage_count: Number.parseInt(result.usage_count),
      }

      modelsData[model].push(entry)

      // Also create a formatted result for the overall results array
      formattedResults.push({
        log_model: model,
        date: entry.date,
        total_prompt_tokens: result.total_prompt_tokens,
        total_completion_tokens: result.total_completion_tokens,
        total_tokens: result.total_tokens,
        total_cost: result.total_cost,
        usage_count: result.usage_count,
      })
    })

    return {
      data: modelsData,
      results: formattedResults,
    }
  }

  async execute(messages: any, _options?: { req: any, user?: IAuthUser, ip?: string, ua: string } & ChatCompletionDto): Promise<Observable<any>> {
    const options = { ..._options }

    delete options.req

    getLogger().log(`[Completion] Invoke ${options.model}`)
    const meta = $aiProviderManager.getProviderMeta(options.model)
    if (!meta)
      throw new BusinessException('Provider not found')

    const internalController = new AbortController()

    _options.req.socket.addListener('end', () => {
      internalController.abort()

      getLogger().log(`[Completion] Abort ${options.model}`)
    })

    if (options.templateId !== undefined && options.templateId !== -1) {
      const template = await this.promptRepository.findOne({
        where: {
          id: options.templateId,
          status: PromptStatus.ONLINE,
        },
      })

      if (template) {
        options._template = template

        // usage
        const usage = this.entityManager.create(PromptUsageEntity, {
          prompt: template,
          user: {
            id: options.user?.uid,
          },
          model: options.model,
        })

        await usage.save()

        getLogger().log(`[Completion] Using template: ${template.title} #${template.id}`)
      }
    }

    const user = await this.entityManager.findOneBy(UserEntity, {
      id: options.user.uid,
    })

    const ob$ = new Observable((subscriber) => {
      const _invoke = async () => {
        getLogger().log(`[Completion] Model \`${options.model}\` chain started.`)
        const providerChat = meta.create(options.chat_id, internalController.signal)

        providerChat.useOptions({
          maxTokens: 8192,
          temperature: options.temperature,
        })
        providerChat.useVariable({
          uid: `${encodeText(`${user.id}`)}`,
          name: user.nickname,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
          ua: options.ua,
          ip: options.ip,
        })
        providerChat.useChatMessages(options.messages)

        /* if (options.generateTitle)
          providerChat.useTemplate(quotaConfig.title)
        else */ if (options._template)
          providerChat.useTemplate(options._template.content)

        providerChat.processObservable(subscriber, {
          handleLog: async (chatInfo) => {
            const { user, ip } = options
            if (user) {
              await this.log(`${user.uid}`, ip)
            }

            // log
            await this.logMsg({
              userId: user?.uid,
              messageType: /* options.generateSummary === 1 ? ChatMsgType.COMPLETION_PROMPT_POLISH : options.generateSummary === 2 ? ChatMsgType.COMPLETION_PROMPT_TRANSLATION : */ (options.model === QuotaModel.QUOTA_THIS_TITLE ? ChatMsgType.GENERATE_TITLE : ChatMsgType.COMPLETION),
              model: options.model,
              duration: Date.now() - chatInfo.meta.startTime.getTime(),
              isStream: true,
              promptTokens: chatInfo.tokens.prompt,
              completionTokens: chatInfo.tokens.completion,
              cost: chatInfo.price.prompt + chatInfo.price.completion,
              status: internalController.signal.aborted ? ChatMsgStatus.CANCELED : ChatMsgStatus.SUCCESS,
              description: JSON.stringify({ temperature: options.temperature }),
              userIp: ip,
              deviceInfo: options.ua,
              sessionId: providerChat.getSessionId(),
            })
          },
          complete: () => {
            getLogger().log(`[Execute AIGC] Complete`)
          },
        })
      }

      _invoke()
    })

    return ob$
  }

  // 创建prompt
  async createPromptTemplate(options: {
    user: IAuthUser
    title: string
    content: string
    avatar: string
    description: string
    keywords: string
  }) {
    const { user, title, content, avatar, description, keywords } = options

    const prompt = this.promptRepository.create({
      content,
      title,
      avatar,
      keywords,
      description,
      status: PromptStatus.WAIT,
      creator: {
        id: user.uid,
      },
      updater: {
        id: user.uid,
      },
    })

    const doc = await $esClient.index({
      index: INDEX_NAME,
      body: prompt,
    })

    prompt.es_id = doc._id

    await prompt.save()

    return prompt
  }

  // Edit prompt template
  async editPromptTemplate(options: {
    user: IAuthUser
    id: number
    title: string
    content: string
    avatar: string
    description: string
    keywords: string
  }) {
    const { user, id, title, content, avatar, description, keywords } = options

    const prompt = await this.promptRepository.findOneBy({
      id,
      creator: {
        id: user.uid,
      },
    })

    if (!prompt)
      throw new BusinessException('Prompt not found')

    if (!prompt.es_id) {
      // throw new BusinessException('Prompt ES_ID not found')
      const doc = await $esClient.index({
        index: INDEX_NAME,
        body: prompt,
      })

      prompt.es_id = doc._id

      console.warn(`Prompt ES_ID not found, create new ES_ID: ${doc._id}`)
    }
    else {
      await $esClient.update({
        index: INDEX_NAME,
        id: prompt.es_id,
        body: {
          doc: prompt,
        },
      })
    }

    const res = this.promptRepository.update(id, {
      title,
      content,
      avatar,
      keywords,
      description,
      status: PromptStatus.WAIT,
      updater: {
        id: user.uid,
      },
    })

    const audit = this.promptAuditRepository.create({
      reason: '修改提交',
      status: PromptStatus.WAIT,
      prompt,
      auditor: {
        id: user.uid,
      },
    })

    await audit.save()

    return res
  }

  // get prompt list
  async getPromptList({ pageSize, page, keyword, status }: PromptQueryDto) {
    const queryBuilder = this.promptRepository
      .createQueryBuilder('prompts')
      // .leftJoinAndSelect('sys_user', 'user', 'items.order_id = orders.id')
      .leftJoinAndSelect('prompts.creator', 'creator')
      .leftJoinAndSelect('prompts.updater', 'updater')
      .leftJoinAndSelect('prompts.usages', 'usages')
      .leftJoinAndSelect('prompts.audits', 'audits')
      .leftJoinAndSelect('prompts.tags', 'tags')
      // 加入 audits 的creator
      .leftJoinAndSelect('audits.auditor', 'auditor')
      .orderBy('prompts.updatedAt', 'DESC')

    if (keyword) {
      queryBuilder.andWhere('(prompts.title LIKE :keyword OR prompts.content LIKE :keyword)', { keyword: `%${keyword}%` })
    }

    if (status !== undefined) {
      queryBuilder.andWhere('prompts.status = :status', { status })
    }

    return paginate<PromptEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  async setPromptStatus(user: IAuthUser, id: number, online: boolean) {
    await this.entityManager.transaction(async (manager) => {
      const prompt = await manager.findOne(PromptEntity, {
        where: { id },
      })

      if (isEmpty(prompt))
        throw new BusinessException('Prompt not found')

      const audit = manager.create(PromptAuditEntity, {
        status: online ? PromptStatus.ONLINE : PromptStatus.OFFLINE,
        reason: online ? '上线标签' : '下线标签',
        prompt,
        auditor: {
          id: user.uid,
        },
      })

      prompt.status = online ? PromptStatus.ONLINE : PromptStatus.OFFLINE

      await $esClient.update({
        index: INDEX_NAME,
        id: prompt.es_id,
        body: {
          doc: prompt,
        },
      })

      await manager.save(audit)

      await manager.update(PromptEntity, id, {
        status: prompt.status,
        updater: {
          id: user.uid,
        },
      })
    })
  }

  // audit template
  async auditPromptTemplate(user: IAuthUser, id: number, { status, reason }: PromptAuditDto) {
    const prompt = await this.promptRepository.findOneBy({
      id,
    })

    if (isEmpty(prompt))
      throw new BusinessException('Prompt not found')

    if (prompt.status !== PromptStatus.WAIT)
      throw new BusinessException('Prompt status error')

    return await this.entityManager.transaction(async (manager) => {
      const audit = manager.create(PromptAuditEntity, {
        status,
        reason,
        prompt,
        auditor: {
          id: user.uid,
        },
      })

      await $esClient.update({
        index: INDEX_NAME,
        id: prompt.es_id,
        body: {
          doc: prompt,
        },
      })

      await manager.save(audit)

      await manager.update(PromptEntity, id, {
        status,
        updater: {
          id: user.uid,
        },
      })

      return audit
    })
  }

  // 给prompt分配标签
  async assignPromptTag(user: IAuthUser, id: number, tagIds: number[]) {
    const prompt = await this.promptRepository.findOne({
      where: { id },
      relations: ['tags'], // 确保查询到当前已有的标签
    })

    if (isEmpty(prompt)) {
      throw new BusinessException('Prompt not found')
    }

    return await this.entityManager.transaction(async (manager) => {
      // 删除旧的标签关联
      await manager
        .createQueryBuilder()
        .relation(PromptEntity, 'tags')
        .of(prompt)
        .remove(prompt.tags)

      // 添加新的标签关联
      await manager
        .createQueryBuilder()
        .relation(PromptEntity, 'tags')
        .of(prompt)
        .add(tagIds)

      const audit = this.promptAuditRepository.create({
        reason: `分配标签: ${tagIds.join(', ')}`,
        status: PromptStatus.OFFLINE,
        prompt,
        auditor: {
          id: user.uid,
        },
      })

      manager.save(PromptAuditEntity, audit)

      prompt.status = PromptStatus.OFFLINE

      await $esClient.update({
        index: INDEX_NAME,
        id: prompt.es_id,
        body: {
          doc: prompt,
        },
      })

      // 更新其他属性
      return manager.update(PromptEntity, id, {
        updater: { id: user.uid },
        status: prompt.status,
      })
    })
  }

  async getPromptHotList() {
    // 去 prompt_usage 表统计最热的排行 然后返回前3
    // 如果用户需要更多必须自行搜索
    const queryBuilder = this.promptRepository
      .createQueryBuilder('prompts')
      .leftJoinAndSelect('prompts.usages', 'usages')
      // .select('prompts, COUNT(usages.id) AS usageCount') // 选择提示和使用次数
      // .groupBy('prompts.id') // 按提示ID分组
      // .orderBy('usageCount', 'DESC') // 按使用次数降序排列
      .limit(10) // 限制结果为前3个

    // const queryBuilder = this.promptRepository
    //   .createQueryBuilder('prompts')
    //   .leftJoinAndSelect('prompts.usages', 'usages')
    //   .where('(prompts.title LIKE :keyword OR prompts.content LIKE :keyword) AND prompts.status = :status', { status: PromptStatus.ONLINE, keyword: `%${keyword}%` })
    //   .orderBy('prompts.updatedAt', 'DESC')

    const res = await queryBuilder.getMany()

    return res.map((item) => {
      const _item = { ...item }

      delete _item.content

      return _item
    })
  }

  // 搜索 prompt
  async searchPrompt(options: PromptSearchDto) {
    const { pageSize, page, keyword } = options

    const res = await $esClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: keyword,
                  fields: ['title', 'description'],
                },
              },
              {
                term: {
                  status:
                    PromptStatus.ONLINE,
                },
              },
            ],
          },
        },
      },
      from: (page - 1) * pageSize,
      size: pageSize,
    })

    // const queryBuilder = this.promptRepository
    //   .createQueryBuilder('prompts')
    //   .leftJoinAndSelect('prompts.usages', 'usages')
    //   .where('(prompts.title LIKE :keyword OR prompts.content LIKE :keyword) AND prompts.status = :status', { status: PromptStatus.ONLINE, keyword: `%${keyword}%` })
    //   .orderBy('prompts.updatedAt', 'DESC')

    // const res = await paginate<PromptEntity>(queryBuilder, {
    //   page,
    //   pageSize,
    // })
    const result = res.hits.hits.map((item) => {
      const _item = item._source as PromptEntity

      delete _item['@timestamp']
      delete _item.content

      return _item
    })

    /* {
      items: res.items.map((item) => {
        const _item = { ...item }

        delete _item.content

        return _item
      }),
      meta: res.meta,
    } */

    return result
  }

  // 搜索 Prompt Tag
  async searchPromptTag(keyword: string) {
    const queryBuilder = this.promptTagRepository
      .createQueryBuilder('prompt_tag')
      .where('(prompt_tag.name LIKE :keyword OR prompt_tag.description LIKE :keyword) AND prompt_tag.status = :status', { keyword: `%${keyword}%`, status: 1 })
      .orderBy('prompt_tag.updatedAt', 'DESC')

    return queryBuilder.getMany()
  }

  async getPrompt(id: number) {
    return await this.promptRepository.findOneBy({
      id,
      status: PromptStatus.PASS,
    })
  }

  // 统计当日数据
  // 1. 今日审核通过 已通过量 审核失败量 提交
  async getTodayData() {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const queryBuilder = this.promptAuditRepository
      .createQueryBuilder('audits')
      .select('audits.status, COUNT(audits.id) AS count')
      .where('audits.updatedAt BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .groupBy('audits.status')

    return await queryBuilder.getRawMany()
  }

  async getTargetUserData(uid: number) {
    const queryBuilder = this.promptAuditRepository
      .createQueryBuilder('audits')
      .select('audits.status, COUNT(audits.id) AS count')
      .where('audits.creator_id = :id', { id: uid })
      .groupBy('audits.status')

    return await queryBuilder.getRawMany()
  }

  async refreshAll(user: IAuthUser) {
    await this.entityManager.transaction(async (manager) => {
      // 找到所有状态异常的
      // 1. 没有填写description或keywords
      const queryBuilder = manager
        .createQueryBuilder(PromptEntity, 'prompts')
        // or
        .orWhere('prompts.description = :description', { description: '' })
        .orWhere('prompts.keywords = :keywords', { keywords: '' })

      const results = await queryBuilder.getMany()

      for (const result of results) {
        // 将状态异常的驳回
        await manager.update(PromptEntity, result.id, {
          status: PromptStatus.REJECT,
          updater: {
            id: user.uid,
          },
        })

        // 处理审核
        const audit = manager.create(PromptAuditEntity, {
          prompt: {
            id: result.id,
          },
          status: PromptStatus.REJECT,
          auditor: {
            id: user.uid,
          },
          reason: '模板填写不完善',
        })

        await audit.save()

        getLogger().log(`Prompt ${result.id} is rejected because of incomplete information`)
      }

      return true
    })
  }

  async createPromptTag(user: IAuthUser, dto: PromptTagDto) {
    const { name, description, color, icon, weight, status, parentTagId } = dto
    const promptTag = this.promptTagRepository.create({
      name,
      description,
      color,
      icon,
      weight,
      status,
      parentTagId: parentTagId || -1,
      creator: {
        id: user.uid,
      },
      updater: {
        id: user.uid,
      },
    })
    await this.promptTagRepository.save(promptTag)

    return promptTag
  }

  async editPromptTag(user: IAuthUser, id: number, dto: PromptTagDto) {
    const promptTag = await this.promptTagRepository.findOneBy({
      id,
    })
    if (isEmpty(promptTag))
      throw new BusinessException('Prompt tag not found')

    const { name, description, color, icon, weight, status, parentTagId } = dto

    return await this.promptTagRepository.update(id, {
      name,
      description,
      color,
      icon,
      weight,
      status,
      parentTagId: parentTagId || -1,
      updater: {
        id: user.uid,
      },
    })
  }

  async getPromptTagList({ page, pageSize }: PromptTagQueryDto) {
    const queryBuilder = this.promptTagRepository
      .createQueryBuilder('prompt_tag')
      .leftJoinAndSelect('prompt_tag.creator', 'creator')
      .leftJoinAndSelect('prompt_tag.updater', 'updater')
      .orderBy('prompt_tag.weight', 'DESC')
      .orderBy('prompt_tag.createdAt', 'DESC')

    return paginate<PromptTagEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  async getPromptTagRecommend() {
    const queryBuilder = this.promptTagRepository
      .createQueryBuilder('prompt_tag')
      .where({
        status: 1,
        parentTagId: -1,
      })
      .orderBy('prompt_tag.weight', 'DESC')
      .orderBy('prompt_tag.createdAt', 'DESC')
      .limit(15)

    return paginate<PromptTagEntity>(queryBuilder, {
      page: 1,
      pageSize: 5,
    })
  }

  async getPromptTag(id: number) {
    return await this.promptTagRepository.findOneBy({
      id,
    })
  }

  async getPromptDetail(id: number) {
    const prompt = await this.promptRepository.findOneBy({
      id,
    })

    if (isEmpty(prompt)) {
      throw new BusinessException('Prompt not found')
    }

    return {
      ...prompt,
      content: null,
    }
  }

  async createShareMessage(id: string, user: IAuthUser) {
    return this.entityManager.transaction(async (manager) => {
      const chatMessage = await manager.findOneBy(ChatMessage, {
        chat_id: id,
        user: {
          id: user.uid,
        },
      })

      if (isEmpty(chatMessage))
        throw new BusinessException('Chat message not found')

      // 先判断有没有
      let shareMessage = await manager.findOneBy(ChatShareMessage, {
        chat: {
          id: chatMessage.id,
        },
      })

      if (!isEmpty(shareMessage)) {
        shareMessage.topic = chatMessage.topic
        shareMessage.value = chatMessage.value
      }
      else {
        shareMessage = manager.create(ChatShareMessage, {
          uuid: randomUUID(),
          topic: chatMessage.topic,
          value: chatMessage.value,
          chat: {
            id: chatMessage.id,
            chat_id: chatMessage.chat_id,
          },
          user: {
            id: user.uid,
          },
        })
      }

      await manager.save(shareMessage)

      return shareMessage
    })
  }

  // 创建出来的ShareMessage只要知道UUID即可访问
  async getShareMessage(uuid: string) {
    const res = await this.entityManager.findOne(ChatShareMessage, {
      where: {
        uuid,

      },
      relations: ['user'],
    })

    return {
      ...res,
      user: {
        id: res.user.id,
        nickname: res.user.nickname,
        avatar: res.user.avatar,
        remark: res.user.remark,
      },
    }
  }

  async getChatShareMessage(chat_id: string) {
    return this.entityManager.findOneBy(ChatShareMessage, {
      chat: {
        chat_id,
      },
    })
  }

  // 获取某个用户的所有分享记录
  async getUserShareList(page: number, pageSize: number, user: IAuthUser) {
    const queryBuilder = this.entityManager.createQueryBuilder(ChatShareMessage, 'chat_message_share')
      .where({
        user_id: user.uid,
      })
      .orderBy('chat_message_share.updated_at', 'DESC')

    return paginate<ChatShareMessage>(queryBuilder, {
      page,
      pageSize,
    })
  }

  async createIndex() {
    const isIndexExist = await $esClient.indices.exists({
      index: INDEX_NAME,
    })

    if (!isIndexExist) {
      throw new BusinessException(`Index not exist ${INDEX_NAME}`)
    }
  }
}
