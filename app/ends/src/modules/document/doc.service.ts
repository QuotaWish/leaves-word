import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { getLogger } from '~/common/interceptors/logging.interceptor'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { DocProtocolEntity, DocRecordEntity, DocumentEntity } from '~/modules/document/doc.entity'

import { decodeText, encodeText, withResolvers } from '~/utils'

import { DocDto, DocQueryDto, DocStatus } from './doc.dto'

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(DocumentEntity)
    private docRepository: Repository<DocumentEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  async list({
    page,
    pageSize,
  }: DocQueryDto): Promise<Pagination<Partial<DocumentEntity> & { record: DocRecordEntity }>> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('docs')
      .where({
        status: DocStatus.PUBLISHED,
        permission: '',
      })

    const result = await paginate<DocumentEntity>(queryBuilder, { page, pageSize })

    const items: (Partial<DocumentEntity> & { record: DocRecordEntity })[] = []

    getLogger().log(`[Document] Get published list for page ${result.meta.currentPage}/${result.meta.totalPages} with ${result.meta.totalItems} items`)

    // TODO: optimized
    for (const item of result.items) {
      const record = await this.docRepository.manager.findOne(DocRecordEntity, {
        where: {
          doc: {
            id: item.id,
          },
        },
        relations: ['user'],
      })

      if (record.content)
        record.content = decodeText(record.content)

      // 如果在 DocProtocol 能找到
      const protocol = await this.docRepository.manager.findOne(DocProtocolEntity, {
        where: {
          doc: {
            id: record.id,
          },
        },
      })
      if (isEmpty(protocol)) {
        items.push({
          ...item,
          record,
        })
      }
    }

    return {
      items,
      meta: result.meta,
    }
  }

  async adminList({
    page,
    pageSize,
  }: DocQueryDto): Promise<Pagination<DocumentEntity>> {
    const queryBuilder = this.docRepository
      .createQueryBuilder('document')
      .where({

      })

    return paginate<DocumentEntity>(queryBuilder, { page, pageSize })
  }

  async detail(id: number): Promise<[DocumentEntity, DocRecordEntity]> {
    const item = await this.docRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    const record = await this.docRepository.manager.findOne(DocRecordEntity, {
      where: {
        doc: {
          id: item.id,
        },
      },
      order: {
        updatedAt: 'DESC',
      },
    })

    record.content = decodeText(record.content)

    return [item, record]
  }

  // 新建文档
  async create(user: IAuthUser, { title, content, meta, permission }: DocDto): Promise<DocumentEntity> {
    const { promise, resolve } = withResolvers<DocumentEntity>()

    await this.entityManager.transaction(async (manager) => {
      const docEntity = manager.create(DocumentEntity, {
        title,
        status: DocStatus.DRAFT,
        meta,
        permission,
      })

      const doc = await docEntity.save()

      const recordEntity = manager.create(DocRecordEntity, {
        content: encodeText(content),
        doc: {
          id: docEntity.id,
        },
        user: {
          id: user.uid,
        },
        reason: '新建',
        status: DocStatus.DRAFT,
      })

      await recordEntity.save()

      resolve(doc)
    })

    return promise
  }

  // 临时保存 => 用户编辑状态保存 => 不产生历史记录
  async tempSave(id: number, user: IAuthUser, { title, meta, content }: DocDto) {
    await this.entityManager.transaction(async (manager) => {
      const doc = await manager.findOne(DocumentEntity, {
        where: {
          id,
        },
      })

      doc.meta = meta
      doc.title = title
      doc.status = DocStatus.DRAFT

      // 获得最近的一条record 时间最近的draft
      let record: DocRecordEntity | null = await manager.findOne(DocRecordEntity, {
        where: {
          doc: {
            id,
          },
          status: DocStatus.DRAFT,
        },
        order: {
          updatedAt: 'DESC',
        },
      })

      if (isEmpty(record)) {
        record = manager.create(DocRecordEntity, {
          content: encodeText(content),
          doc: {
            id,
          },
          user: {
            id: user.uid,
          },
          reason: '保存记录',
          status: DocStatus.DRAFT,
        })

        await doc.save()
        await record.save()
      }
      else {
        record.content = encodeText(content)

        await doc.save()
        await record.save()
      }
    })
  }

  // 更新文档 将会保存历史记录
  async update(id: number, user: IAuthUser, { title, content, meta }: DocDto) {
    await this.entityManager.transaction(async (manager) => {
      const doc = await manager.findOne(DocumentEntity, {
        where: {
          id,
        },
      })

      doc.title = title
      doc.meta = meta
      doc.status = DocStatus.UNPUBLISHED

      const record = manager.create(DocRecordEntity, {
        content: encodeText(content),
        doc: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '更新文档',
        status: DocStatus.UNPUBLISHED,
      })

      await doc.save()
      await record.save()
    })
  }

  async delete(id: number, user: IAuthUser) {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(DocumentEntity, {
        id,
      }, {
        status: DocStatus.ARCHIVED,
      })

      const record: DocRecordEntity | null = await manager.findOne(DocRecordEntity, {
        where: {
          doc: {
            id,
          },
        },
        order: {
          updatedAt: 'DESC',
        },
      })

      // 如果没有记录不允许归档
      if (isEmpty(record)) {
        throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION)
      }

      // 如果记录不是已发布/未发布不允许归档
      if (record.status !== DocStatus.PUBLISHED && record.status !== DocStatus.UNPUBLISHED)
        throw new BusinessException('文档状态异常')

      // 获得最近的一条record 时间最近的draft
      const archivedRecord = manager.create(DocRecordEntity, {
        content: record.content,
        doc: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '归档文档',
        status: DocStatus.ARCHIVED,
      })

      archivedRecord.save()
    })

    return true
  }

  async publishVersion(id: number, user: IAuthUser) {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(DocumentEntity, {
        id,
      }, {
        status: DocStatus.PUBLISHED,
      })

      const record: DocRecordEntity | null = await manager.findOne(DocRecordEntity, {
        where: {
          doc: {
            id,
          },
        },
        order: {
          updatedAt: 'DESC',
        },
      })

      // 如果没有记录不允许发版
      if (isEmpty(record)) {
        throw new BusinessException(ErrorEnum.ILLEGAL_OPERATION)
      }

      // 如果记录不是未发布不允许发版
      if (record.status !== DocStatus.UNPUBLISHED)
        throw new BusinessException('文档状态异常')

      // 获得最近的一条record 时间最近的draft
      const publishRecord = manager.create(DocRecordEntity, {
        content: record.content,
        doc: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '发布文档',
        status: DocStatus.PUBLISHED,
      })

      publishRecord.save()

      // const publishVersion = manager.create(DocPublishEntity, {
      //   doc: {
      //     id,
      //   },
      //   auditor: {
      //     id: user.uid,
      //   },
      //   record: {
      //     id: publishRecord.id,
      //   },
      // })

      // publishVersion.save()
    })

    return true
  }

  // 将某个文档设置为协议
  async setAgreement(key: string, id: number, user: IAuthUser) {
    const doc = await this.docRepository.findOneBy({
      id,
    })
    if (isEmpty(doc))
      throw new NotFoundException()

    if (doc.status !== DocStatus.UNPUBLISHED)
      throw new BusinessException('文档状态异常')

    doc.status = DocStatus.PROTOCOL
    await doc.save()

    let res = await this.getAgreement(id)

    if (isEmpty(res)) {
      res = this.entityManager.create(DocProtocolEntity, {
        operator: {
          id: user.uid,
        },
        doc: {
          id,
        },
        key,
      })

      await res.save()
    }

    return res
  }

  // 根据id获取文档协议
  async getAgreement(id: number) {
    return await this.entityManager.findOne(DocProtocolEntity, {
      where: {
        id,
      },
      relations: ['doc', 'operator'],
    })
  }

  // 根据key获取文档协议
  async getAgreementByKey(key: string) {
    if (!key)
      throw new BadRequestException()

    const protocol = await this.entityManager.findOne(DocProtocolEntity, {
      where: {
        key,
      },
      relations: ['doc'],
    })
    if (isEmpty(protocol))
      throw new NotFoundException()

    const detail = await this.detail(protocol.doc.id)

    return {
      ...protocol,
      detail,
    }
  }
}
