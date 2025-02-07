import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { MoreThan, Repository } from 'typeorm'

import { paginate } from '~/helper/paginate'

import { createLivechatDto, queryLivechatDto, updateLivechatDto } from './livechat.dto'
import { LiveChatEntity } from './livechat.entity'

@Injectable()
export class LiveChatservice {
  constructor(@InjectRepository(LiveChatEntity) private readonly livechatRepository: Repository<LiveChatEntity>) {

  }

  createLivechat(data: createLivechatDto) {
    const livechat = {
      ...data,
      phone: JSON.stringify(data.phone),
    }
    this.livechatRepository.save(livechat)
  }

  findAll(data: queryLivechatDto) {
    const queryBuilder = this.livechatRepository.createQueryBuilder()

    return paginate<LiveChatEntity>(queryBuilder, {
      page: data.page,
      pageSize: data.pageSize,
      ...data,
    })
  }

  updateLiveChat(id: number, data: updateLivechatDto) {
    return this.livechatRepository.update(id, { ...data, phone: JSON.stringify(data.phone) })
  }

  removeLiveChat(id: number) {
    return this.livechatRepository.delete(id)
  }

  randomOne() {
    return this.livechatRepository.findOneBy({
      updatedAt: MoreThan(new Date(Date.now() - 1000 * 60 * 60 * 24)),
    })
  }
}
