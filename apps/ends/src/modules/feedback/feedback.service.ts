import { Injectable } from '@nestjs/common'

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { Repository } from 'typeorm/repository/Repository'

import { paginate } from '~/helper/paginate'

import { CreateFeedbackDto, FeedbackQueryDto, UpdateFeedbackDto } from './dto/feedback.dto'
import { FeedbackEntity } from './entities/feedback.entity'

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity) private readonly feedbackRepository: Repository<FeedbackEntity>,

    @InjectEntityManager() private entityManager: EntityManager,
  ) {

  }

  // @ApiTags('Feedback') // 添加标签
  // @ApiOperation({
  //   summary: '创建反馈', // 操作的简短描述
  //   description: '根据提供的数据创建一个新的反馈条目', // 更详细的描述
  // })
  // @ApiBody({
  //   type: CreateFeedbackDto,
  //   required: true,
  //   description: '创建反馈所需的 DTO',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: '成功创建反馈',
  //   type: CreateFeedbackDto, // 或者是返回的具体类型
  // })
  async create(dto: CreateFeedbackDto, user: IAuthUser) {
    // 为每一个createFeedbackDto 生成一个反馈单号，格式是：时间-type-随机数,存入数据库
    await this.entityManager.transaction(async (manager) => {
      const feedback = manager.create(FeedbackEntity, { ...dto, user: { id: user.uid } })
      feedback.createdAt = new Date()
      feedback.feedId = `T-${Date.now()}-${dto.feedType}-${Math.random().toString(36).substring(2, 6)}`
      await manager.save(feedback)
      console.log('feedback:', feedback)
      return feedback
    })
  }

  findAll({ page, pageSize }: FeedbackQueryDto) {
    // 返回所有数据
    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .orderBy('feedback.updatedAt', 'DESC')

    // console.log('queryBuilder:', queryBuilder.getQueryAndParameters())
    return paginate<FeedbackEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  async findOne(user: IAuthUser, { page, pageSize }: FeedbackQueryDto) {
    const queryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .where({
        user: {
          id: user.uid,
        },
      })
      .orderBy('feedback.createdAt', 'DESC')

    return paginate<FeedbackEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackRepository.update(id, updateFeedbackDto)
  }

  remove(id: string) {
    return this.feedbackRepository.delete(id)
  }
}
