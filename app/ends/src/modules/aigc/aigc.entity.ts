import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

import { PromptStatus } from './aigc.dto'

@Entity('aigc')
export class AiGcEntity extends CommonEntity {
  @Column()
  @ApiProperty({ description: 'aigc' })
  value: string

  @ApiProperty({ description: 'aigc' })
  @Column({ default: false })
  status: boolean

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}

@Entity('chat_message')
export class ChatMessage extends CommonEntity {
  @Column({ length: 128 })
  @ApiProperty({ description: '当前对话唯一ID' })
  chat_id: string

  @Column('mediumtext')
  value!: string

  @ManyToOne(() => UserEntity, user => user.accessTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity

  @Column({ length: 128 })
  @ApiProperty({ description: 'Conversation Topic' })
  topic: string

  // @Column('text')
  // @ApiProperty({ description: 'Conversation Meta' })
  // meta: string

  @Column()
  user_id: number
}

/**
 * 分享对话设计
 * 1.用户第一次创建的时候内容固定
 * 2.后续更新的时候判断ShareMessage和ChatMessage谁更新时间大，取大的
 */
@Entity('chat_message_share')
export class ChatShareMessage extends CommonEntity {
  @Column({ length: 128 })
  @ApiProperty({ description: '当前分享对话唯一ID' })
  uuid: string

  @OneToOne(() => ChatMessage)
  @JoinColumn({ name: 'chat_id' })
  chat: ChatMessage

  @Column('mediumtext')
  value!: string

  @ManyToOne(() => UserEntity, user => user.accessTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity

  @Column({ length: 128 })
  @ApiProperty({ description: 'Conversation Topic' })
  topic: string

  @Column()
  user_id: number
}

export enum ChatMsgType {
  GENERATE_TITLE,
  COMPLETION,
  GENERATE_IMAGE,
  GENERATE_VIDEO,
  GENERATE_AUDIO,
  GENERATE_DOCUMENT,
  COMPLETION_PROMPT_POLISH,
  COMPLETION_PROMPT_TRANSLATION,
}

export enum ChatMsgStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  PROCESSING = 'processing',
  CANCELED = 'canceled',
  TOO_MANY_REQUESTS = 'too_many_requests',
  TIMEOUT = 'timeout',
}

@Entity('chat_messages_log')
export class ChatMsgLogEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '唯一标识符' })
  id: number

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '用户ID' })
  user?: UserEntity

  @Column()
  @ApiProperty({ description: '消息类型（生成标题/问题/补全对话/生成图片等）' })
  message_type: string

  @Column()
  @ApiProperty({ description: '使用的模型' })
  model: string

  @Column({ type: 'bigint' })
  @ApiProperty({ description: '用时（时间戳差，单位为毫秒）' })
  duration: number

  @Column({ default: false })
  @ApiProperty({ description: '是否为流式（true/false）' })
  is_stream: boolean

  @Column()
  @ApiProperty({ description: '提示消耗的tokens' })
  prompt_tokens: number

  @Column()
  @ApiProperty({ description: '补全消耗的tokens' })
  completion_tokens: number

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  @ApiProperty({ description: '消费金额，精确到小数点后6位' })
  cost: number

  @Column()
  @ApiProperty({ description: '消息状态（如：成功、失败、处理中等）' })
  status: string

  @Column({ nullable: true })
  @ApiProperty({ description: '说明' })
  description?: string

  @Column({ nullable: true })
  @ApiProperty({ description: '用户IP地址（IPv4/IPv6）' })
  user_ip?: string

  @Column({ nullable: true })
  @ApiProperty({ description: '用户设备信息（如浏览器、操作系统等）' })
  device_info?: string

  @Column({ nullable: true })
  @ApiProperty({ description: '会话ID，用于跟踪用户会话' })
  session_id?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: '记录创建时间' })
  created_at: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: '记录更新时间' })
  updated_at: Date
}

@Entity('prompts')
export class PromptEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 1000 }) // 使用 VARCHAR(1000) 来存储提示文本
  @ApiProperty({ description: '提示文本' })
  content: string

  @Column({ length: 255 }) // 限制标题长度为255个字符
  @ApiProperty({ description: '提示词标题' })
  title: string

  @Column({ length: 255 })
  @ApiProperty({ description: '提示词描述' })
  description: string

  @Column({ length: 255 })
  @ApiProperty({ description: '提示关键词，用逗号分隔' })
  keywords: string

  @Column({ length: 64 })
  @ApiProperty({ description: 'ES ID' })
  es_id: string

  @Column({ type: 'varchar', length: 255, nullable: true }) // 头像字段可以为空，存储图片的 URL
  @ApiProperty({ description: '提示词头像', nullable: true })
  avatar: string

  @ApiProperty({ enum: PromptStatus, enumName: 'PromptStatus', description: '模板状态' })
  @Column({ type: 'tinyint' })
  @IsEnum(PromptStatus)
  status: number

  @OneToMany(() => PromptUsageEntity, usage => usage.prompt)
  @ApiProperty({ description: '使用记录' })
  usages: Relation<PromptUsageEntity[]>

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  @ApiProperty({ description: '创建者' })
  creator: UserEntity

  // 更新者
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updater_id' })
  @ApiProperty({ description: '更新者' })
  updater: UserEntity

  @OneToMany(() => PromptAuditEntity, audit => audit.prompt)
  @ApiProperty({ description: '审核记录' })
  audits: Relation<PromptAuditEntity[]>

  @ManyToMany(() => PromptTagEntity, tag => tag.prompts)
  @ApiProperty({ description: '标签' })
  @JoinTable({ name: 'prompt_tag_relation' })
  tags: PromptTagEntity[]
}

@Entity('prompt_tag')
export class PromptTagEntity extends CommonEntity {
  @Column({ length: 255 })
  @ApiProperty({ description: '标签名称' })
  name: string

  @Column({ type: 'text' })
  @ApiProperty({ description: '标签描述' })
  description: string

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: '父级标签 ID', nullable: true })
  parentTagId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  @ApiProperty({ description: '创建者' })
  creator: UserEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'updater_id' })
  @ApiProperty({ description: '更新者' })
  updater: UserEntity

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '标签颜色', nullable: true })
  color: string

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '标签图标', nullable: true })
  icon: string

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: '标签权重', nullable: true })
  weight: number

  @ManyToMany(() => PromptEntity, prompt => prompt.tags)
  @JoinColumn({ name: 'prompt_id' })
  @ApiProperty({ description: '关联的提示词' })
  prompts: Relation<PromptEntity[]>

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: '标签状态', nullable: true })
  status: number
}

// prompt 审核entity
@Entity('prompt_audit')
export class PromptAuditEntity extends CommonEntity {
  @ApiProperty({ enum: PromptStatus, enumName: 'PromptStatus', description: '模板状态' })
  @Column({ type: 'tinyint' })
  @IsEnum(PromptStatus)
  status: number

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'creator_id' })
  @ApiProperty({ description: '审核人' })
  auditor: UserEntity

  @Column({ nullable: true })
  @ApiProperty({ description: '审核意见' })
  reason: string

  @ManyToOne(() => PromptEntity, prompt => prompt.audits)
  @JoinColumn({ name: 'prompt_id' })
  @ApiProperty({ description: '关联的提示' })
  prompt: PromptEntity
}

@Entity('prompt_usage')
export class PromptUsageEntity extends CommonEntity {
  @ManyToOne(() => PromptEntity, prompt => prompt.usages)
  @JoinColumn({ name: 'prompt_id' })
  @ApiProperty({ description: '关联的提示' })
  prompt: PromptEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '使用者' })
  user: UserEntity

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty({ description: '使用模型' })
  model: string
}
