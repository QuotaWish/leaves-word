import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  type RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { FastifyRequest } from 'fastify'
import { PayKit } from 'tnwx'

import { Bypass } from '~/common/decorators/bypass.decorator'
import { BusinessException } from '~/common/exceptions/biz.exception'
import { getLogger } from '~/common/interceptors/logging.interceptor'
import { globalWxOptions } from '~/common/tnwx/init'
import { getWxPay } from '~/common/tnwx/pay/wechat-pay'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'
import { Public } from '../auth/decorators/public.decorator'

import { SubscribeService } from '../subscribe/subscribe.service'

import { DummyOrderDto, OrderQueryDto, PaymentMethod, SubscribeOrderDto } from './order.dto'
import { OrderService } from './order.service'

export const permissions = definePermission('order', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Order模块')
@UseGuards(ResourceGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly subscribeService: SubscribeService,
  ) { }

  @Public()
  @Get('test_order')
  async testOrder() {
    // todo
  }

  @Get('price')
  @ApiOperation({ summary: '根据订阅获得价格' })
  async getPrice(@AuthUser() user: IAuthUser, @Query() subscribeDto: SubscribeOrderDto) {
    // 首先判断是否是试用套装，试用要求是不能有任何订阅记录
    const isTrial = String(subscribeDto.time).includes('TRIAL')

    return this.orderService.getFee(user, isTrial, subscribeDto.type, subscribeDto.time, subscribeDto.couponCode || '')
  }

  @Get('price/dummy')
  @ApiOperation({ summary: '充值钱包余额' })
  async getPriceDummy(@AuthUser() user: IAuthUser, @Query() dummyDto: DummyOrderDto) {
    return this.orderService.getDummyFee(user, dummyDto.value, dummyDto.couponCode || '')
  }

  // 订阅下单
  @Post('subscribe')
  @ApiOperation({ summary: '订阅下单' })
  async subscribeOrder(@AuthUser() user: IAuthUser, @Body() subscribeDto: SubscribeOrderDto) {
    if (subscribeDto.payMethod === PaymentMethod.ALIPAY) {
      throw new BusinessException('AliPay not support yet.')
    }

    return this.orderService.subscribeOrder(user, subscribeDto)
  }

  // 订阅下单
  @Post('balance')

  @ApiOperation({ summary: '余额充值' })
  async balanceOrder(@AuthUser() user: IAuthUser, @Body() dummyDto: DummyOrderDto) {
    if (dummyDto.payMethod !== PaymentMethod.WECHAT) {
      throw new BusinessException('Only support wechat pay.')
    }

    return this.orderService.dummyOrder(user, dummyDto)
  }

  // 查询订阅
  @Get('subscribe')
  @ApiOperation({ summary: '查询订阅', description: '用于用户支付后确认订阅是否成功，有5分钟延迟，如果不指定id则返回用户当前拥有的最新订阅' })
  async getSubscribe(@AuthUser() user: IAuthUser, @Query('id') id: string) {
    return id ? this.subscribeService.getUserSubscriptionStatus(user, id) : user.subscription
  }

  // 获取订单信息
  @Get('target')
  @ApiOperation({ summary: '查询订单', description: '用户重新返回支付相关信息（先返回用户最近一条需要支付的订单）' })
  async getOrderTarget(@AuthUser() user: IAuthUser) {
    return this.orderService.getNearestOrder(user)
  }

  // 获取订单信息
  @Get('list')
  @ApiOperation({ summary: '查询订单列表', description: '返回用户历史订单列表' })
  async getOrderList(@AuthUser() user: IAuthUser) {
    const res = await this.orderService.getOrders(user.uid)

    return res.map(item => ({
      ...item,
      additionalInfo: undefined,
    }))
  }

  @Get('status/target')

  @ApiOperation({ summary: '查询订单状态' })
  async getOrderStatus(@AuthUser() user: IAuthUser, @Query('id') id: string) {
    return this.orderService.getOrderStatus(user.uid, id)
  }

  @Public()
  @Bypass()
  @Post('/pay/wechat/notify.action')
  @ApiOperation({ summary: '微信支付回调(请勿手动调用）' })
  async payWxCallback(
    @Headers('Wechatpay-Serial') serial: string,
    @Headers('Wechatpay-Timestamp') timestamp: string,
    @Headers('Wechatpay-Nonce') nonce: string,
    @Headers('Wechatpay-Signature') signature: string,
    @Req() req: RawBodyRequest<FastifyRequest>,
  ) {
    if (!serial?.length || !timestamp?.length || !nonce?.length || !signature?.length)
      throw new BusinessException('Cannot analyze this headers.')

    const body = req.rawBody.toString()

    if (!body?.length)
      throw new BusinessException('Cannot analyze this body.')

    const ret = await getWxPay().verifySign({
      body,
      signature,
      serial,
      nonce,
      timestamp,
    })

    if (!ret)
      throw new BusinessException('Cannot verify this signature.')

    const data = JSON.parse(body)
    const { id, resource_type, event_type, summary } = data
    getLogger().log(`[Order] [WechatPay] 支付状态通报已通过审核: @${id} | #${summary} | ResourceType: ${resource_type} (As event ${event_type})`)

    const { resource } = data
    const { ciphertext, associated_data, nonce: resourceNonce } = resource

    const decrypt = PayKit.aes256gcmDecrypt(
      globalWxOptions.PAY_KEY,
      resourceNonce,
      associated_data,
      ciphertext,
    )

    console.log('decrypt', decrypt)

    return this.orderService.callbackOrder(data, JSON.parse(decrypt))
  }

  // 管理员后台查询所有订单列表
  @Post('admin/list')
  @ApiOperation({ summary: '管理员后台查询所有订单列表' })
  @Perm([permissions.LIST, permissions.READ])
  async getOrderListAdmin(@Body() dto: OrderQueryDto) {
    return this.orderService.getOrderList(dto)
  }

  @Get('admin/statistics')
  @ApiOperation({ summary: '管理员后台查询所有订单统计' })
  @Perm([permissions.LIST, permissions.READ])
  async getOrderStatisticsAdmin() {
    return this.orderService.getOrderStatistics()
  }
}
