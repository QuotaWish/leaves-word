import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CouponUsageTransactionEntity, PaymentCouponEntity } from '../coupon/coupon.entity'
import { CouponService } from '../coupon/coupon.service'
import { SubscriptionPlanEntity } from '../subscribe/subscribe.entity'

import { SubscribeService } from '../subscribe/subscribe.service'

import { OrderController } from './order.controller'
import { OrderEntity, OrderItemEntity } from './order.entity'
import { OrderService } from './order.service'

const services = [OrderService, SubscribeService, CouponService]

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, SubscriptionPlanEntity, PaymentCouponEntity, CouponUsageTransactionEntity])],
  controllers: [OrderController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class OrderModule { }
