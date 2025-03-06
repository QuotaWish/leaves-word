import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { EntityManager, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { getLogger } from '~/common/interceptors/logging.interceptor'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'
import { Pagination } from '~/helper/paginate/pagination'
import { PostEntity, PostRecordEntity } from '~/modules/community/post.entity'

import { decodeText, encodeText, withResolvers } from '~/utils'

import { PostDto, PostQueryDto, PostStatus } from './community.dto'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private PostRepository: Repository<PostEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) { }

  async list({
    page,
    pageSize,
  }: PostQueryDto): Promise<Pagination<Partial<PostEntity> & { record: PostRecordEntity }>> {
    const queryBuilder = this.PostRepository
      .createQueryBuilder('Posts')
      .where({
        status: PostStatus.PUBLISHED,
        permission: '',
      })

    const result = await paginate<PostEntity>(queryBuilder, { page, pageSize })

    const items: (Partial<PostEntity> & { record: PostRecordEntity })[] = []

    getLogger().log(`[Post] Get published list for page ${result.meta.currentPage}/${result.meta.totalPages} with ${result.meta.totalItems} items`)

    // TODO: optimized
    for (const item of result.items) {
      const record = await this.PostRepository.manager.findOne(PostRecordEntity, {
        where: {
          post: {
            id: item.id,
          },
        },
        relations: ['user'],
      })

      if (record.content)
        record.content = decodeText(record.content)
    }

    return {
      items,
      meta: result.meta,
    }
  }

  async adminList({
    page,
    pageSize,
  }: PostQueryDto): Promise<Pagination<PostEntity>> {
    const queryBuilder = this.PostRepository
      .createQueryBuilder('post')
      .where({

      })

    return paginate<PostEntity>(queryBuilder, { page, pageSize })
  }

  async detail(id: number): Promise<[PostEntity, PostRecordEntity]> {
    const item = await this.PostRepository.findOneBy({ id })
    if (!item)
      throw new NotFoundException('未找到该记录')

    const record = await this.PostRepository.manager.findOne(PostRecordEntity, {
      where: {
        post: {
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
  async create(user: IAuthUser, { title, content, meta, permission }: PostDto): Promise<PostEntity> {
    const { promise, resolve } = withResolvers<PostEntity>()

    await this.entityManager.transaction(async (manager) => {
      const post = manager.create(PostEntity, {
        title,
        status: PostStatus.DRAFT,
        meta,
        permission,
      })

      const res = await post.save()

      const recordEntity = manager.create(PostRecordEntity, {
        content: encodeText(content),
        post: {
          id: post.id,
        },
        user: {
          id: user.uid,
        },
        reason: '新建',
        status: PostStatus.DRAFT,
      })

      await recordEntity.save()

      resolve(res)
    })

    return promise
  }

  // 临时保存 => 用户编辑状态保存 => 不产生历史记录
  async tempSave(id: number, user: IAuthUser, { title, meta, content }: PostDto) {
    await this.entityManager.transaction(async (manager) => {
      const Post = await manager.findOne(PostEntity, {
        where: {
          id,
        },
      })

      Post.meta = meta
      Post.title = title
      Post.status = PostStatus.DRAFT

      // 获得最近的一条record 时间最近的draft
      let record: PostRecordEntity | null = await manager.findOne(PostRecordEntity, {
        where: {
          post: {
            id,
          },
          status: PostStatus.DRAFT,
        },
        order: {
          updatedAt: 'DESC',
        },
      })

      if (isEmpty(record)) {
        record = manager.create(PostRecordEntity, {
          content: encodeText(content),
          post: {
            id,
          },
          user: {
            id: user.uid,
          },
          reason: '保存记录',
          status: PostStatus.DRAFT,
        })

        await Post.save()
        await record.save()
      }
      else {
        record.content = encodeText(content)

        await Post.save()
        await record.save()
      }
    })
  }

  // 更新文档 将会保存历史记录
  async update(id: number, user: IAuthUser, { title, content, meta }: PostDto) {
    await this.entityManager.transaction(async (manager) => {
      const post = await manager.findOne(PostEntity, {
        where: {
          id,
        },
      })

      post.title = title
      post.meta = meta
      post.status = PostStatus.UNPUBLISHED

      const record = manager.create(PostRecordEntity, {
        content: encodeText(content),
        post: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '更新文档',
        status: PostStatus.UNPUBLISHED,
      })

      await post.save()
      await record.save()
    })
  }

  async delete(id: number, user: IAuthUser) {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(PostEntity, {
        id,
      }, {
        status: PostStatus.ARCHIVED,
      })

      const record: PostRecordEntity | null = await manager.findOne(PostRecordEntity, {
        where: {
          post: {
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
      if (record.status !== PostStatus.PUBLISHED && record.status !== PostStatus.UNPUBLISHED)
        throw new BusinessException('文档状态异常')

      // 获得最近的一条record 时间最近的draft
      const archivedRecord = manager.create(PostRecordEntity, {
        content: record.content,
        post: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '归档文档',
        status: PostStatus.ARCHIVED,
      })

      archivedRecord.save()
    })

    return true
  }

  async publishVersion(id: number, user: IAuthUser) {
    await this.entityManager.transaction(async (manager) => {
      await manager.update(PostEntity, {
        id,
      }, {
        status: PostStatus.PUBLISHED,
      })

      const record: PostRecordEntity | null = await manager.findOne(PostRecordEntity, {
        where: {
          post: {
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
      if (record.status !== PostStatus.UNPUBLISHED)
        throw new BusinessException('文档状态异常')

      // 获得最近的一条record 时间最近的draft
      const publishRecord = manager.create(PostRecordEntity, {
        content: record.content,
        post: {
          id,
        },
        user: {
          id: user.uid,
        },
        reason: '发布文档',
        status: PostStatus.PUBLISHED,
      })

      publishRecord.save()

      // const publishVersion = manager.create(PostPublishEntity, {
      //   Post: {
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
}
