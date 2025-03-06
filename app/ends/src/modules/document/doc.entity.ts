import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Relation } from 'typeorm'

import { CommonEntity } from '~/common/entity/common.entity'
import { UserEntity } from '~/modules/user/user.entity'

import { DocStatus } from './doc.dto'

// DocumentEntity 类
@Entity('document')
export class DocumentEntity extends CommonEntity {
  @Column({ length: 30 })
  @ApiProperty({ description: 'Document title' })
  title: string

  @ApiProperty({ enum: DocStatus, enumName: 'DocStatus', description: 'Doc Enable Status' })
  @Column({ type: 'tinyint' })
  @IsEnum(DocStatus)
  status: DocStatus

  @OneToMany(() => DocRecordEntity, usage => usage.doc)
  @ApiProperty({ description: '使用记录' })
  records: Relation<DocRecordEntity[]>

  // publish
  // @ApiProperty({ description: '最新发布记录，如果为空则表示未发布或者已重置发布' })
  // publish: Relation<DocPublishEntity>

  @Column({ type: 'varchar' })
  @ApiProperty({ description: 'Document Meta' })
  meta: string

  @ApiProperty({ description: '查看需要的用户组，留空则为不允许任何查看，填写 public 则所有人可以查看' })
  @Column({ default: '' })
  permission: string

  // @Column({ type: 'int', nullable: false })
  // @ApiProperty({ description: '文档版本号' })
  // version: number
}

// DocRecordEntity 类
@Entity('doc_record')
export class DocRecordEntity extends CommonEntity {
  @ManyToOne(() => DocumentEntity, prompt => prompt.records)
  @JoinColumn({ name: 'doc_id' })
  @ApiProperty({ description: '关联的文档' })
  doc: DocumentEntity

  @Column({ type: 'longtext', nullable: false }) // 将 uuid 字段替换为 int 类型，并确保不为空
  @ApiProperty({ description: '内容' })
  content: string

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ description: '变动原因' })
  reason: string

  @ApiProperty({ enum: DocStatus, enumName: 'DocStatus', description: '记录的状态' })
  @Column({ type: 'tinyint' })
  @IsEnum(DocStatus)
  status: DocStatus

  @ManyToOne(() => UserEntity, { nullable: false }) // 添加 nullable: false 确保关系不为空
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>
}

// DocPublishEntity 类
// @Entity('doc_publish')
// export class DocPublishEntity extends CommonEntity {
//   @ManyToOne(() => DocumentEntity, prompt => prompt.records)
//   @JoinColumn({ name: 'prompt_id' })
//   @ApiProperty({ description: '关联的文档' })
//   doc: DocumentEntity

//   @ManyToOne(() => UserEntity)
//   @JoinColumn({ name: 'auditor_id' })
//   @ApiProperty({ description: '审核人' })
//   auditor: UserEntity

//   @ManyToOne(() => DocRecordEntity)
//   @JoinColumn({ name: 'record_id' })
//   @ApiProperty({ description: '关联的文档记录' })
//   record: DocRecordEntity
// }

// DocProtocol 类 定义某个文档为协议
@Entity('doc_protocol')
export class DocProtocolEntity extends CommonEntity {
  @Column({ length: 30 })
  @ApiProperty({ description: 'Protocol Key' })
  key: string

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  operator: Relation<UserEntity>

  @OneToOne(() => DocumentEntity, { nullable: false })
  @JoinColumn({ name: 'doc_id' })
  doc: Relation<DocumentEntity>
}
