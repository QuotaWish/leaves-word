import https from 'node:https'

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Put,
  Query,
  type RawBodyRequest,
  Req,
  Sse,
  Version,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { FastifyRequest } from 'fastify'

import { Observable } from 'rxjs'

import { ApiResult } from '~/common/decorators/api-result.decorator'

import { Bypass } from '~/common/decorators/bypass.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { Public } from '../auth/decorators/public.decorator'

import { QuotaModel } from './ai/types'
import { ChatCompletionDto, ChatLogQueryDto, ChatMessageDto, ChatMessageQueryDto, PromptAuditDto, PromptDto, PromptQueryDto, PromptSearchDto, PromptTagDto, PromptTagQueryDto } from './aigc.dto'
import { ChatMessage, ChatMsgLogEntity, PromptEntity, PromptTagEntity } from './aigc.entity'
import { AiGcService } from './aigc.service'

export const permissions = definePermission('aigc', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  AUDIT: 'audit',
  ADMIN: 'admin',
} as const)

// function wrapAbort(res: Request) {
//   const controller = new AbortController()

//   res.connection.addListener('close', () => {
//     console.log('close')
//     controller.abort()
//   })

//   return controller.signal
// }

@ApiTags('Business - AiGc模块')
@Controller('aigc')
export class AigcController {
  constructor(private readonly aigcService: AiGcService) { }

  @Post('/executor')
  @Sse('/executor')
  @ApiBody({
    type: ChatCompletionDto,
  })
  @ApiOperation({ summary: 'Try executors' })
  async executorAuthorized(@Req() req: RawBodyRequest<FastifyRequest>, @AuthUser() user: IAuthUser, @Ip() ip: string, @Headers('user-agent') ua: string, @Body() body: ChatCompletionDto): Promise<Observable<any>> {
    const { messages } = body
    if (!messages || !messages.length)
      throw new BusinessException(`messages is required(${messages?.length ?? -1})`)

    const model = body.model ?? QuotaModel.QUOTA_THIS_NORMAL
    const subscription = user.subscription
    if (model === QuotaModel.QUOTA_THIS_NORMAL_ULTRA && subscription?.type !== 'ULTIMATE') {
      throw new BusinessException('this model only available for ULTIMATE subscription user')
    }

    if (model === QuotaModel.QUOTA_THIS_NORMAL_TURBO && !subscription?.type)
      throw new BusinessException('this model only available for STANDARD and ULTIMATE subscription user')

    await this.aigcService.conversationLimit(ip, `${user.uid}`) // 检查用户是否超过对话限制

    // for (const msg of messages) {
    //   const { content } = msg

    //   const tokens = encode(content).length * 1.25
    //   if (tokens > 4096)
    //     throw new BusinessException(`message content must be less than 4096 tokens, but got ${msg.content.length} tokens`)
    // }

    return this.aigcService.execute(messages, { ...body, req, user, ip, ua })
  }

  // 分页
  @Get('/conversations')
  @ApiOperation({ summary: '获取历史对话列表，默认按照倒叙排列' })
  @ApiResult({ type: [ChatMessage], isPage: true })
  async list(@AuthUser() user: IAuthUser, @Query() dto: ChatMessageQueryDto) {
    return this.aigcService.list(user.uid, dto)
  }

  @Get('/history')
  @Version('2')
  @ApiOperation({ summary: '获取历史对话列表，默认按照倒叙排列（不包含对话内容）' })
  @ApiResult({ type: [ChatMessage], isPage: true })
  async conversations(@AuthUser() user: IAuthUser, @Query() dto: ChatMessageQueryDto) {
    return this.aigcService.conversationList(user.uid, dto)
  }

  @Get('/conversation/:id')
  @ApiOperation({ summary: '获取单个对话' })
  @ApiResult({ type: ChatMessage })
  async get(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.aigcService.getConversationDetail(user.uid, id)
  }

  // 分页
  @Get('/chat_log')
  @ApiOperation({ summary: '获取对话日志，默认按照倒叙排列' })
  @ApiResult({ type: [ChatMsgLogEntity], isPage: true })
  @Perm(permissions.LIST)
  async listChatLog(@Query() dto: ChatLogQueryDto) {
    return this.aigcService.chatLogList(dto)
  }

  @Get('/chat_log/statistics')
  @Perm(permissions.READ)
  @ApiOperation({ summary: '获取对话日志统计信息，默认获得近三天的信息（不包含今天）' })
  async getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string, // 先作为字符串接收
  ) {
    // 如果没有提供开始和结束日期，设置为默认值
    const today = new Date()
    const defaultEndDate = new Date(today.setUTCHours(0, 0, 0, 0)) // 今天的开始时间
    const defaultStartDate = new Date(defaultEndDate)
    defaultStartDate.setDate(defaultStartDate.getDate() - 7) // 近7天

    const start = startDate ? new Date(startDate) : defaultStartDate
    const end = endDate ? new Date(endDate) : defaultEndDate

    // 检查日期格式是否有效
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BusinessException('Invalid date format. Please provide valid startDate and endDate.')
    }

    // 检查 userId 是否为数字
    const userIdNumber = userId ? Number.parseInt(userId, 10) : undefined
    if (userId && Number.isNaN(userIdNumber)) {
      throw new BusinessException('Invalid userId format. Please provide a valid userId.')
    }

    // 调用服务获取统计信息
    const statistics = await this.aigcService.getStatistics(start, end, userIdNumber)

    return statistics
  }

  @Get('consumption_statistics')
  @Perm(permissions.READ)
  @ApiOperation({ summary: '获取对话日志趋势，默认按照倒叙排列' })
  async getConsumptionStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // 如果没有提供开始和结束日期，设置为默认值
    const today = new Date()
    const defaultEndDate = new Date(today.setUTCHours(0, 0, 0, 0)) // 今天的开始时间
    const defaultStartDate = new Date(defaultEndDate)
    defaultStartDate.setDate(defaultStartDate.getDate() - 3) // 近三天

    const start = startDate ? new Date(startDate) : defaultStartDate
    const end = endDate ? new Date(endDate) : defaultEndDate

    // 检查日期格式是否有效
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BusinessException('Invalid date format. Please provide valid startDate and endDate.')
    }

    return this.aigcService.getConsumptionStatistics(start, end)
  }

  // 查询某个用户的对话

  // 创建对话
  @Post('/conversations')
  @ApiOperation({ summary: '创建对话', description: '如果传入的uid存在，则会自动更新' })
  @Perm(permissions.CREATE)
  async create(@AuthUser() user: IAuthUser, @Body() dto: ChatMessageDto) {
    // 序列化对话日志 防止存储敏感信息
    const valueObj = JSON.parse(decodeURIComponent(atob(dto.value))) // 会自动报错
    // 传入的应该是一个数组
    // if (!Array.isArray(valueObj)) {
    //   throw new BusinessException('value must be an array')
    // }

    // TODO 后面要改成由服务端存储content
    // const msgObj = [...valueObj].map(item => ({
    //   date: item.date,
    //   role: item.role,
    //   content: item.content,
    //   status: item.status,
    //   meta: item.meta,
    //   agent: item.agent,
    // }))

    dto.value = btoa(encodeURIComponent(JSON.stringify(valueObj)))

    const conversation = await this.aigcService.get(user.uid, dto.chat_id)
    if (conversation != null) {
      return this.aigcService.update(conversation.id, dto)
    }

    const subscription = user.subscription

    const limit = subscription?.type === 'ULTIMATE' ? 5000 : (subscription?.type === 'STANDARD' ? 1000 : 300)

    const amo = await this.aigcService.count(user.uid)
    if (amo >= limit)
      throw new BusinessException('对话数量已达上限，订阅以提高数量限制！')

    return this.aigcService.create(user.uid, dto)
  }

  @Delete('/conversations/:id')
  @ApiOperation({ summary: '删除对话' })
  @Perm(permissions.DELETE)
  async delete(@AuthUser() user: IAuthUser, @Param('id') id: string) {
    return this.aigcService.delete(user.uid, id)
  }

  // 管理prompt    prompt是免费对所有人开放的
  @Post('/prompts/list')
  @ApiOperation({ summary: '获取所有prompt' })
  @ApiResult({ type: [PromptEntity], isPage: true })
  @Perm(permissions.READ)
  async prompts(@Body() body: PromptQueryDto) {
    return this.aigcService.getPromptList(body)
  }

  // 创建prompt
  @Post('/prompts')
  @ApiOperation({ summary: '创建prompt' })
  @Perm(permissions.CREATE)
  async createPrompt(@AuthUser() user: IAuthUser, @Body() dto: PromptDto) {
    return this.aigcService.createPromptTemplate({
      user,
      ...dto,
    })
  }

  @Put('/prompts/:id')
  @ApiOperation({ summary: '更新prompt' })
  @Perm(permissions.UPDATE)
  async updatePrompt(@AuthUser() user: IAuthUser, @Param('id') id: number, @Body() dto: PromptDto) {
    return this.aigcService.editPromptTemplate({
      user,
      id,
      ...dto,
    })
  }

  @Post('/prompts/audit/:id')
  @ApiOperation({ summary: '审核prompt' })
  @Perm(permissions.AUDIT)
  async auditPrompt(@AuthUser() user: IAuthUser, @Param('id') id: number, @Body() dto: PromptAuditDto) {
    return this.aigcService.auditPromptTemplate(user, id, dto)
  }

  // 分配标签
  @Post('/prompts/audit/assign_tags/:id')
  @ApiOperation({ summary: '分配模板标签' })
  @Perm(permissions.CREATE)
  async assignPromptTag(@AuthUser() user: IAuthUser, @Param('id') id: number, @Body() dto: { tags: number[] }) {
    return this.aigcService.assignPromptTag(user, id, dto.tags)
  }

  // 搜索 PromptTag
  @Get('/prompts/tags/search')
  @ApiOperation({ summary: '搜索 PromptTag' })
  @ApiResult({ type: [PromptTagEntity], isPage: true })
  @Perm(permissions.READ)
  async promptsTagsSearch(@Query('keyword') keyword: string) {
    return this.aigcService.searchPromptTag(keyword)
  }

  // 获取prompt补全对话框的内容 按照热度排行（使用次数 7days in）
  @Get('/prompts/hot')
  @ApiOperation({ summary: '获取热门prompt' })
  @ApiResult({ type: [PromptEntity], isPage: true })
  @Public()
  async promptsHot() {
    return this.aigcService.getPromptHotList()
  }

  // 设置某个prompt template的状态 online true代表上线 false代表下线
  @Put('/prompts/status/:id')
  @ApiOperation({ summary: '设置prompt状态' })
  @Perm(permissions.UPDATE)
  async promptsStatus(@AuthUser() user: IAuthUser, @Param('id') id: number, @Body() dto: { online: boolean }) {
    return this.aigcService.setPromptStatus(user, id, dto.online)
  }

  // search prompt
  @Get('/prompts/search')
  @ApiOperation({ summary: '搜索prompt' })
  @Public()
  @ApiResult({ type: [PromptEntity], isPage: true })
  async promptsSearch(@Query() query: PromptSearchDto) {
    return this.aigcService.searchPrompt(query)
  }

  // get target prompt
  @Get('/prompts/:id')
  @ApiOperation({ summary: '获取prompt' })
  @ApiResult({ type: PromptEntity })
  async promptsTarget(@Param('id') id: number) {
    return this.aigcService.getPrompt(id)
  }

  @Get('/prompts/statistics')
  @ApiOperation({ summary: '统计prompt' })
  @Perm(permissions.READ)
  async statisticsPrompt() {
    return this.aigcService.getTodayData()
  }

  @Post('/prompts/tags/create')
  @ApiOperation({ summary: '创建prompt标签' })
  @Perm(permissions.CREATE)
  async createPromptTag(@AuthUser() user: IAuthUser, @Body() dto: PromptTagDto) {
    return this.aigcService.createPromptTag(user, dto)
  }

  @Put('/prompts/tags/:id')
  @ApiOperation({ summary: '更新prompt标签' })
  @Perm(permissions.UPDATE)
  async updatePromptTag(@AuthUser() user: IAuthUser, @Param('id') id: number, @Body() dto: PromptTagDto) {
    return this.aigcService.editPromptTag(user, id, dto)
  }

  @Post('/prompts/tags/list')
  @ApiOperation({ summary: '获取prompt标签' })
  @ApiResult({ type: [PromptTagEntity], isPage: true })
  @Perm(permissions.READ)
  async promptsTags(@Body() body: PromptTagQueryDto) {
    return this.aigcService.getPromptTagList(body)
  }

  @Get('/prompts/tags/recommend')
  @ApiOperation({ summary: '获取推荐prompt标签' })
  @ApiResult({ type: [PromptTagEntity] })
  @Public()
  async promptsTagsRecommend() {
    return this.aigcService.getPromptTagRecommend()
  }

  @Get('/prompts/user')
  @ApiOperation({ summary: '获取用户prompt数据' })
  @ApiResult({ type: [PromptEntity] })
  @Perm(permissions.READ)
  async promptsUser(@AuthUser() user: IAuthUser) {
    return this.aigcService.getTargetUserData(user.uid)
  }

  @ApiOperation({ summary: '刷新所有状态，限制一分钟一次' })
  @Perm(permissions.ADMIN)
  @Post('/prompts/refresh_all')
  @Throttle({ default: { ttl: 60, limit: 1 } })
  refreshAll(@AuthUser() user: IAuthUser) {
    setTimeout(() => this.aigcService.refreshAll(user))

    return 'accept'
  }

  @ApiOperation({ summary: '查询某个prompt的详细数据' })
  @Public()
  @Get('/prompts/detail/:id')
  async promptsDetail(@Param('id') id: number) {
    return this.aigcService.getPromptDetail(id)
  }

  @ApiOperation({ summary: '将某个对话转为分享' })
  @Post('/conversation/share/:uuid')
  async conversationShare(@AuthUser() user: IAuthUser, @Param('uuid') id: string) {
    return this.aigcService.createShareMessage(id, user)
  }

  @Public()
  @ApiOperation({ summary: '获取分享对话' })
  @Get('/conversation/share/:id')
  async getShareConversation(@Param('id') id: string) {
    return this.aigcService.getShareMessage(id)
  }

  @ApiOperation({ summary: '根据对话chat_id获取对话分享记录' })
  @Get('/conversation/share_chat/:chat_id')
  async getChatShareConversation(@Param('chat_id') id: string) {
    return this.aigcService.getChatShareMessage(id)
  }

  @ApiOperation({ summary: '获取某个用户的所有分享记录' })
  @Get('/conversation/share_list')
  async getShareList(@AuthUser() user: IAuthUser, @Query() query: { page: number, pageSize: number }) {
    return this.aigcService.getUserShareList(query.page, query.pageSize, user)
  }

  @Public()
  @Bypass()
  @ApiOperation({ summary: '获取某个单词的发音' })
  @Get('/pronounce/word/:word')
  async getWordPrnounce(@Param('word') word: string) {
    // 将url获取的流返回： http://dict.youdao.com/dictvoice?audio=${word}
    const url = `https://dict.youdao.com/dictvoice?audio=${word}`

    return new Promise<Buffer>((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch audio: ${response.statusCode}`))
          return
        }

        const data: Buffer[] = []
        response.on('data', (chunk) => {
          data.push(chunk)
        })

        response.on('end', () => {
          const uint8ArrayData = data.map(buffer => new Uint8Array(buffer))
          resolve(Buffer.concat(uint8ArrayData))
        })

        response.on('error', (err) => {
          reject(err)
        })
      }).on('error', (err) => {
        reject(err)
      })
    })
  }
}
