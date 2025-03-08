import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import { PagerDto } from '~/common/dto/pager.dto'

import { SubscribeTime, SubscribeType } from '../subscribe/subscribe.dto'

// 订单状态
export enum OrderStatus {
  DEFAULT = 0, // 全部/默认
  // WAIT_PAY = 1, // 待支付
  FINISH = 1, // 已完成
  CANCEL = 2, // 已取消
  TIMEOUT_PAY = 3, // 超时未支付
  WAIT_REFUND = 4, // 待退款
  REFUNDED = 5, // 已退款
  WAIT_REFUND_AGREE = 6, // 待退款审核
}

export enum PaymentMethod {
  ALIPAY = 1, // 支付宝
  WECHAT = 2, // 微信
  BALANCE = 3, // 余额
}

export enum WechatTradeState {
  SUCCESS = 'SUCCESS', // 支付成功
  REFUND = 'REFUND', // 退款中
  NOTPAY = 'NOTPAY', // 未支付
  CLOSED = 'CLOSED', // 已关闭
  REVOKED = 'REVOKED', // 已撤销（付款码支付）
  USERPAYING = 'USERPAYING', // 用户支付中（付款码支付）
  PAYERROR = 'PAYERROR', // 支付失败(其他原因，如银行返回失败)'
}

export class SubscribeOrderDto {
  @ApiProperty({ enum: SubscribeType, enumName: 'SubscribeType', description: '订阅类型' })
  @IsEnum(SubscribeType)
  type: SubscribeType

  @ApiProperty({ enum: SubscribeTime, enumName: 'SubscribeTime', description: '订阅时间' })
  @IsEnum(SubscribeTime)
  time: SubscribeTime

  @ApiProperty({ enum: PaymentMethod, enumName: 'PaymentMethod', description: '付款方式' })
  @IsEnum(PaymentMethod)
  payMethod: PaymentMethod

  @ApiProperty({ description: '优惠码' })
  @IsString()
  @IsOptional()
  couponCode: string
}

export class DummyOrderDto {
  @ApiProperty({ description: '充值点数' })
  @IsNumber()
  value: number

  @ApiProperty({ enum: PaymentMethod, enumName: 'PaymentMethod', description: '付款方式' })
  @IsEnum(PaymentMethod)
  payMethod: PaymentMethod

  @ApiProperty({ description: '优惠码' })
  @IsString()
  @IsOptional()
  couponCode: string
}

export class OrderDto {
  @ApiProperty({ description: '购买用户' })
  @IsString()
  @IsOptional()
  user_id: number

  @ApiProperty({ description: '购买金额范围(min)' })
  @IsOptional()
  @IsNumber()
  min_price: number

  @ApiProperty({ description: '购买金额范围(max)' })
  @IsOptional()
  @IsNumber()
  max_price: number

  @ApiProperty({ enum: OrderStatus, enumName: 'OrderStatus', description: '订单状态' })
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus

  @ApiProperty({ enum: PaymentMethod, enumName: 'PaymentMethod', description: '付款方式' })
  @IsEnum(PaymentMethod)
  @IsOptional()
  payMethod: PaymentMethod

  @ApiProperty({ description: '支付时间范围(min)' })
  @IsOptional()
  min_pay_time: Date

  @ApiProperty({ description: '支付时间范围(max)' })
  @IsOptional()
  max_pay_time: Date
}

export class OrderQueryDto extends IntersectionType(PagerDto, OrderDto) {}
