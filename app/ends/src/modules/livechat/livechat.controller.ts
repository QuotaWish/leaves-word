import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { ApiOperation } from '@nestjs/swagger'

import { Perm, definePermission } from '../auth/decorators/permission.decorator'

import { Public } from '../auth/decorators/public.decorator'

import { createLivechatDto, queryLivechatDto, updateLivechatDto } from './livechat.dto'
import { LiveChatservice } from './livechat.service'

export const permissions = definePermission('livechat', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@Controller('livechat')
export class LiveChatController {
  constructor(
    private readonly livechatService: LiveChatservice,

  ) {}

  @Post()
  @Perm(permissions.CREATE)
  @ApiOperation({ summary: '添加客服' })
  create(data: createLivechatDto) {
    this.livechatService.createLivechat(data)
  }

  @Get('list')
  @Perm(permissions.LIST)
  @ApiOperation({ summary: '获取客服列表' })
  findAll(data: queryLivechatDto) {
    this.livechatService.findAll(data)
  }

  @Put(':id')

  @Perm(permissions.UPDATE)
  @ApiOperation({ summary: '获取客服列表' })
  update(@Param('id') id: number, data: updateLivechatDto) {
    this.livechatService.updateLiveChat(id, data)
  }

  @Delete(':id')
  @Perm(permissions.DELETE)
  @ApiOperation({ summary: '删除客服' })
  remove(@Param('id')id: number) {
    this.livechatService.removeLiveChat(id)
  }

  @Get('/random')
  @Public()
  @ApiOperation({ summary: '随机获取一个客服' })
  random() {
    return this.livechatService.randomOne()
  }
}
