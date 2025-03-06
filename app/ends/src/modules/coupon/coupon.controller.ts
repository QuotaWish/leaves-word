import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { CouponQueryDto, CreateCouponDto } from './coupon.dto'
import { PaymentCouponEntity } from './coupon.entity'
import { CouponService } from './coupon.service'

export const permissions = definePermission('coupon', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Coupon模块')
@UseGuards(ResourceGuard)
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) { }

  @Get('list')
  @ApiOperation({ summary: '获取券码列表（用户）' })
  @ApiResult({ type: [Array<PaymentCouponEntity>] })
  async list(@AuthUser() user: IAuthUser) {
    return this.couponService.getCoupons(user)
  }

  // 获取所有券码
  @Post('all')
  @ApiOperation({ summary: '获取券码列表（管理员）' })
  @ApiResult({ type: [PaymentCouponEntity], isPage: true })
  @Perm(permissions.LIST)
  async all(@Body() body: CouponQueryDto) {
    return this.couponService.getAllCoupons(body)
  }

  // TODO:必须通过短信验证
  // 创建后会广播到群和微信订阅
  @Post('create_batches')
  @ApiOperation({ summary: '批量创建券码' })
  @ApiResult({ type: [PaymentCouponEntity], isPage: true })
  @Perm([permissions.LIST, permissions.READ])
  async createBatches(@AuthUser() user: IAuthUser, @Body() body: CreateCouponDto) {
    return this.couponService.createCoupons(user, body)
  }

  // 分配某个券码给用户
  @Post('assign')
  @ApiOperation({ summary: '分配券码' })
  @ApiResult({ type: PaymentCouponEntity })
  @Perm(permissions.UPDATE)
  async assign(@AuthUser() user: IAuthUser, @Body() body: { uid: number, couponId: string }) {
    return this.couponService.assignCoupon(user, body.uid, body.couponId)
  }

  // 让某个券码失效 => 失效即把maxUsage设置为-1
  @Post('invalidate')
  @ApiOperation({ summary: '让券码失效' })
  @ApiResult({ type: PaymentCouponEntity })
  @Perm(permissions.UPDATE)
  async invalidate(@AuthUser() user: IAuthUser, @Body() body: { couponId: string }) {
    return this.couponService.invalidateCoupon(user, body.couponId)
  }

  // 用户添加优惠券 只要知道了某个优惠券用户就可以添加到账户上，避免忘记
  @Post('add')
  @ApiOperation({ summary: '用户添加优惠券' })
  @ApiResult({ type: PaymentCouponEntity })
  async add(@AuthUser() user: IAuthUser, @Body() body: { couponId: string }) {
    return this.couponService.addUserCoupon(user, body.couponId)
  }
}
