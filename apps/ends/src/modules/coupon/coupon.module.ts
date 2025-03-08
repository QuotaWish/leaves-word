import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CouponController } from './coupon.controller'
import { CouponUsageTransactionEntity, PaymentCouponEntity } from './coupon.entity'
import { CouponService } from './coupon.service'

const services = [CouponService]

@Module({
  imports: [TypeOrmModule.forFeature([PaymentCouponEntity, CouponUsageTransactionEntity])],
  controllers: [CouponController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class CouponModule {}
