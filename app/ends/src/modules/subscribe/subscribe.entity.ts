import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

import { SubscribeType } from './subscribe.dto'

@Entity('subscription_plan')
export class SubscriptionPlanEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  declare id: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: '订阅计划类型' })
  type: SubscribeType

  @Column({ type: 'varchar', length: 32 })
  @ApiProperty({ description: '订阅计划关联订单' })
  orderId: string

  @Column({ type: 'date' })
  @ApiProperty({ description: '订阅开始日期' })
  startDate: Date

  @Column({ type: 'date' })
  @ApiProperty({ description: '订阅结束日期' })
  endDate: Date

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '订阅是否有效' })
  isActive: boolean

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '是否自动续费' })
  autoRenew: boolean

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '是否是试用订阅' })
  isTrial: boolean
}
