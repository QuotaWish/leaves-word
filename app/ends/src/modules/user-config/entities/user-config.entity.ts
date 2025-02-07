import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

@Entity('user_config')
export class UserConfigEntity extends CommonEntity {
  @OneToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column({ type: 'mediumtext', nullable: true, comment: '公开字段' })
  pub_info: string

  @Column({ type: 'mediumtext', nullable: true, comment: '私有字段' })
  pri_info: string
}
