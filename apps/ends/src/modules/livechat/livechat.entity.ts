import { Column, Entity } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity()
export class LiveChatEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 255, comment: '客服称号' })
  name: string

  @Column({ type: 'varchar', length: 255, comment: '二维码' })
  qrcode: string

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  phone: string
}
