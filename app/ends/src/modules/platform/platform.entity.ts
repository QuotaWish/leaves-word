import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('third_party_binding')
export class ThirdPartyBindingEntity extends CommonEntity {
  @Column({ length: 128 })
  @ApiProperty({ description: '第三方服务提供者的名称，例如 Google, Facebook, etc.' })
  provider: string

  @Column({ length: 256, unique: true })
  @ApiProperty({ description: '用户在第三方服务中的唯一标识符，例如用户ID或邮箱' })
  openId: string

  @Column('text', { nullable: true })
  @ApiProperty({ description: '附加的元数据，包括访问令牌和刷新令牌等信息' })
  meta: string

  @Column({ default: false })
  @ApiProperty({ description: '绑定状态，true表示已绑定，false表示未绑定' })
  isActive: boolean

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '与用户的关联' })
  user: Relation<UserEntity>

  @Column({ default: '' })
  @ApiProperty({ description: '权限设置，留空则为不允许任何访问，填写public则所有人可以访问' })
  permission: string
}
