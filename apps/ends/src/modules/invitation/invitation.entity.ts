import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('invitation_records')
export class InvitationRecordEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID，关联用户信息' })
  user: Relation<UserEntity>

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'by_user_id' })
  @ApiProperty({ description: '邀请用户ID，关联用户是谁邀请的' })
  inviteUser: Relation<UserEntity>

  @Column({ type: 'varchar' })
  @ApiProperty({ description: '邀请渠道' })
  source: string
}
