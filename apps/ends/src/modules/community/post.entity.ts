import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

import { PostPermission, PostStatus } from './community.dto'

@Entity('post')
export class PostEntity extends CommonEntity {
  @Column({ length: 36 })
  @ApiProperty({ description: 'Post title' })
  title: string

  @ApiProperty({ enum: PostStatus, enumName: 'PostStatus', description: 'Post Status' })
  @Column({ type: 'tinyint' })
  @IsEnum(PostStatus)
  status: PostStatus

  @OneToMany(() => PostRecordEntity, usage => usage.post)
  @ApiProperty({ description: '使用记录' })
  records: Relation<PostRecordEntity[]>

  @Column({ type: 'varchar' })
  @ApiProperty({ description: 'Document Meta' })
  meta: string

  @ApiProperty({ enum: PostStatus, enumName: 'PostStatus', description: 'Post Permission' })
  @Column({ type: 'tinyint', default: PostPermission.PRIVATE })
  @IsEnum(PostPermission)
  permission: PostPermission
}

// PostRecordEntity 类
@Entity('post_record')
export class PostRecordEntity extends CommonEntity {
  @ManyToOne(() => PostEntity, prompt => prompt.records)
  @JoinColumn({ name: 'post_id' })
  @ApiProperty({ description: '关联的帖子' })
  post: PostEntity

  @Column({ type: 'longtext', nullable: false }) // 将 uuid 字段替换为 int 类型，并确保不为空
  @ApiProperty({ description: '内容' })
  content: string

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ description: '变动原因' })
  reason: string

  @ApiProperty({ enum: PostStatus, enumName: 'PostStatus', description: '记录的状态' })
  @Column({ type: 'tinyint' })
  @IsEnum(PostStatus)
  status: PostStatus

  @ManyToOne(() => UserEntity, { nullable: false }) // 添加 nullable: false 确保关系不为空
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}

// PostPublishEntity 类
@Entity('post_publish')
export class DocPublishEntity extends CommonEntity {
  @ManyToOne(() => PostEntity, prompt => prompt.records)
  @JoinColumn({ name: 'prompt_id' })
  @ApiProperty({ description: '关联的帖子' })
  post: PostEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'auditor_id' })
  @ApiProperty({ description: '审核人' })
  auditor: UserEntity

  @ManyToOne(() => PostRecordEntity)
  @JoinColumn({ name: 'record_id' })
  @ApiProperty({ description: '关联的文档记录' })
  record: PostRecordEntity
}
