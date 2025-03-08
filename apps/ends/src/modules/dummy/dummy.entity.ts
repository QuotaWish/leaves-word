import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('user_points_summary')
export class PointsSummaryEntity extends CommonEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '用户当前积分总数' })
  totalPoints: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '用户可用积分，未过期的积分' })
  availablePoints: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '用户已使用的积分' })
  usedPoints: number

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '用户已失效的积分' })
  freezedPoints: number
}

@Entity('user_points_transaction')
export class PointsTransactionEntity extends CommonEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '相关用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @ManyToOne(() => PointsSummaryEntity)
  @JoinColumn({ name: 'summary_id' })
  @ApiProperty({ description: '用户积分总述ID，关联用户积分信息' })
  summary: Relation<PointsSummaryEntity>

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '变更积分数，正数为增加，负数为减少' })
  pointsChanged: number

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '变更原因，例如活动、购买等' })
  reason: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '关联的订单号' })
  orderId: string

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '积分过期时间' })
  expirationDate: Date

  @Column('text', { nullable: true })
  @ApiProperty({ description: '备注信息，记录与积分变更相关的其他信息' })
  notes: string
}

@Entity('lottery')
export class LotteryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户 ID' })
  user: Relation<UserEntity>

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '次数来源，例如抽奖活动、任务等' })
  source: string

  @Column({ type: 'int', default: 100 })
  @ApiProperty({ description: '权重，用于计算中奖概率' })
  weight: number

  // 是否已使用
  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '是否已使用' })
  used: boolean

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '过期时间' })
  expired_at: Date

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '到账时间' })
  arrival_at: Date

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '使用时间' })
  used_at: Date

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'operator_id' })
  @ApiProperty({ description: '操作人 ID，如果为 null 则是系统自动操作' })
  operator: Relation<UserEntity>
}

// 抽奖记录
@Entity('lottery_record')
export class LotteryRecordEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户 ID' })
  user: Relation<UserEntity>

  @ManyToOne(() => LotteryEntity)
  @JoinColumn({ name: 'lottery_id' })
  @ApiProperty({ description: '抽奖次数 ID' })
  lottery: Relation<LotteryEntity>

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: '中奖时间' })
  win_at: Date

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: '中奖类型' })
  win_type: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: '中奖类型描述' })
  win_type_desc: string
}

// 签到记录
@Entity('sign_record')
export class SignRecordEntity extends CommonEntity {
  @Column({ type: 'int' })
  @ApiProperty({ description: '签到积分' })
  score: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户 ID' })
  user: Relation<UserEntity>
}

// 运势记录
// 暂时不做运势统计 比如得了多少次大吉之类的 就简单一点暂时
@Entity('fortune_record')
export class FortuneRecordEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 5 })
  @ApiProperty({ description: '主要运势' })
  main: string

  @Column({ type: 'varchar', length: 4096 })
  @ApiProperty({ description: '运势内容' })
  content: string

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户 ID' })
  user: Relation<UserEntity>
}
