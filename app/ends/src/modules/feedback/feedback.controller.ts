import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common'

import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { CreateFeedbackDto, FeedbackQueryDto, UpdateFeedbackDto } from './dto/feedback.dto'
import { FeedbackEntity } from './entities/feedback.entity'
import { FeedbackService } from './feedback.service'

@ApiTags('System - 反馈模块')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }
  private readonly logger = new Logger(FeedbackController.name)

  @ApiOperation({ summary: '新增反馈' })
  @Put('create')
  create(@AuthUser() user: IAuthUser, @Body() dto: CreateFeedbackDto) {
    this.logger.log('createFeedbackDto', dto)
    return this.feedbackService.create(dto, user)
  }

  @ApiOperation({ summary: '管理员获取反馈列表' })
  @ApiResult({ type: [FeedbackEntity], isPage: true })
  @Post('listAll')
  findAll(@Body() body: FeedbackQueryDto) {
    return this.feedbackService.findAll(body)
  }

  @ApiOperation({ summary: '用户查询自己提交反馈' })
  @Get('list')
  findOne(@Param() params: FeedbackQueryDto, @AuthUser() user: IAuthUser) {
    return this.feedbackService.findOne(user, params)
  }

  @ApiOperation({ summary: '更新反馈' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto)
  }

  @ApiOperation({ summary: '删除反馈' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id)
  }
}
