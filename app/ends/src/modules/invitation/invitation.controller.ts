import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { Bypass } from '~/common/decorators/bypass.decorator'
import { definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'
import { Public } from '../auth/decorators/public.decorator'

import { InvitationService } from './invitation.service'

export const permissions = definePermission('invitation', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Invitation模块')
@UseGuards(ResourceGuard)
@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) { }

  @Public()
  @Get('list')
  async list() {
    return []
  }

  @Get('records')
  @ApiOperation({ summary: '获取某个用户的邀请记录' })
  async getRecords(@AuthUser() user: IAuthUser) {
    return this.invitationService.getUserInvitationRecords(user.uid)
  }

  @Get('code/image')
  @Bypass()
  @Public()
  @Redirect()
  @ApiOperation({ summary: '获取某个用户的邀请码图片' })
  async fetchImage(@Query('id') id: string) {
    const code = String(id).padStart(6, '0')

    const url = `https://minico.qq.com/qrcode/get?type=2&r=1&size=300&text=https://ai.quotawish.com/invitation?code=${code}%26source=mp`

    return {
      statusCode: HttpStatus.FOUND,
      url,
    }
    // redirect

    // // 使用 axios 请求图片页面
    // const response = await axios.get(url)

    // console.log('a', response)

    // return response.data
  }

  @Get('accept')
  @ApiOperation({ summary: '用户接受邀请' })
  async acceptInvitation(@Query('code') code: number, @Query('source') source: string, @AuthUser() user: IAuthUser) {
    if (code === user.uid)
      throw new Error('不能接受自己的邀请')

    return this.invitationService.acceptInvitation(code, user.uid, source)
  }
}
