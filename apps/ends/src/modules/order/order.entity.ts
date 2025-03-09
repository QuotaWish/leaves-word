import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

import { UserEntity } from '~/modules/user/user.entity'

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn({ primary: true, type: 'varchar', length: 32 })
  // @Column({ type: 'varchar', length: 32 })
  @ApiProperty({ description: '订单ID' })
  id: string

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '订单标题' })
  description: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true })
  @ApiProperty({ description: '订单项' })
  items: OrderItemEntity[]

  @Column({ type: 'tinyint' })
  @ApiProperty({ description: '订单状态' })
  status: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '订单总金额，单位为分' })
  totalAmount: number

  @Column({ type: 'tinyint' })
  @ApiProperty({ description: '支付方式' })
  paymentMethod: number

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '其他情况(折扣，优惠券，限时优惠，续费订单）' })
  additionalInfo: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

@Entity('order_items')
export class OrderItemEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '订单项ID' })
  declare id: number

  @ManyToOne(() => OrderEntity, order => order.items, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  @ApiProperty({ description: '订单ID' })
  order: OrderEntity

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '商品名称' })
  name: string

  @Column({ type: 'decimal', default: 0.00, precision: 16, scale: 2 })
  @ApiProperty({ description: '购买数量' })
  quantity: number

  @Column({ type: 'decimal', default: 0.00, precision: 16, scale: 2 })
  @ApiProperty({ description: '单价' })
  price: number

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: '其他情况(折扣，优惠券，限时优惠，续费订单）' })
  additionalInfo: string
}

export enum SigninStatus {
  SIGNIN, BACKUP, EXPIRED,
}

@Entity('signin')
export class SigninEntity extends CommonEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @Column({ type: 'year' })
  @ApiProperty({ description: '签到年份' })
  year: number

  @Column({ type: 'tinyint' })
  @ApiProperty({ description: '签到月份' })
  month: number

  @Column({ type: 'varchar' })
  @ApiProperty({ description: '签到日期' })
  day: string

  @Column({ type: 'tinyint', default: 2 })
  @ApiProperty({ description: '签到状态' })
  status: SigninStatus
}
