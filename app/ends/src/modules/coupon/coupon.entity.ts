import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity, InfoEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

/**
 * CouponCode 逻辑
 * 1. 通用优惠券不会被用户查询到 必须得手动使用才算（也就是必须知道code）
 * 2. 优惠券绑定了用户之后可以在用户的空间里查询到
 */

@Entity('payment_coupon')
export class PaymentCouponEntity extends InfoEntity<any> {
  @Column({ type: 'varchar', length: 36, unique: true })
  @ApiProperty({ description: '优惠券完整代码，唯一标识' })
  code: string

  @Column({ type: 'varchar', length: 22 })
  @ApiProperty({ description: '核验码-随机码 一共22位' })
  mainCode: string

  @Column({ type: 'int' })
  @ApiProperty({ description: '优惠金额，正数表示优惠的金额，负数表示百分比' })
  discountAmount: number

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '优惠券开始使用时间' })
  startDate: Date

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '优惠券结束使用时间' })
  endDate: Date

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ description: '最大使用次数，0表示无限制' })
  maxUsage: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '已使用次数' })
  usedCount: number

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '关联用户ID，表示该优惠券的归属用户，null表示通用优惠券' })
  user: Relation<UserEntity> | null

  @Column({ type: 'int' })
  @ApiProperty({ description: '使用条件：最低消费金额，低于该金额不可使用优惠券' })
  minimumSpend: number

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: '最大抵扣消费金额，正数表示消费金额[单位：分]，负数表示消费百分比' })
  maximumDiscount: number

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '是否可叠加使用，true表示可叠加，false表示不可叠加' })
  stackable: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '适用商品类别，例如电子产品、服装等' })
  applicableCategories: string

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '是否仅限新用户使用，true表示仅限新用户' })
  newUserOnly: boolean

  // creator
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  @ApiProperty({ description: '创建者ID' })
  creator: Relation<UserEntity>

  // updater
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updater_id' })
  @ApiProperty({ description: '更新者ID' })
  updater: Relation<UserEntity>
}

@Entity('coupon_usage_transaction')
export class CouponUsageTransactionEntity extends CommonEntity {
  @ManyToOne(() => PaymentCouponEntity)
  @JoinColumn({ name: 'coupon_id' })
  @ApiProperty({ description: '使用的优惠券ID' })
  coupon: Relation<PaymentCouponEntity>

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '使用优惠券的用户ID' })
  user: Relation<UserEntity>

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '关联的订单号' })
  orderNumber: string

  // @Column({ type: 'int' })
  // @ApiProperty({ description: '实际使用的优惠金额（单位：分）' })
  // usedAmount: number
}
