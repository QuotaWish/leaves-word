import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'

@Entity('banner_poster')
export class PostsEntity extends CommonEntity {
  @Column({ type: 'varchar', comment: '地址' })
  url: string

  @ManyToOne(() => BannerGroupEntity, group => group.posters)
  @JoinColumn({ name: 'banner_group_id' })
  @ApiProperty({ description: '海报组' })
  bannerGroup: Relation<BannerGroupEntity>
}

export enum BannerMode {
  WHITELIST,
  BLACKLIST,
}

@Entity('banner_group')
export class BannerGroupEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 255, comment: '名称' })
  name: string

  @OneToMany(() => PostsEntity, post => post.bannerGroup)
  posters: Relation<PostsEntity[]>

  @Column({ type: 'varchar', nullable: true, length: 255, comment: '其他属性' })
  property: string

  @Column({ type: 'varchar', nullable: true, length: 255, comment: '用户订阅分组' })
  user_subscribe: string

  @Column({ type: 'varchar', nullable: true, length: 255, comment: '分组黑名单或白名单' })
  mode: BannerMode

  @Column({ type: 'varchar', nullable: true, comment: '开始时间' })
  startAt: Date

  @Column({ type: 'varchar', nullable: true, comment: '结束时间' })
  endAt: Date
}
