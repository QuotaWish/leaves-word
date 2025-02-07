import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { paginate } from '~/helper/paginate'

import { BannerGroupQueryDto, CreateBannerGroupDto, UpdateBannerGroupDto } from './banner.dto'
import { BannerGroupEntity, PostsEntity } from './banner.entity'

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerGroupEntity) private readonly bannerGroupRepository: Repository<BannerGroupEntity>,

    @InjectRepository(PostsEntity) private readonly postsRepository: Repository<PostsEntity>,
  ) { }

  createBannerGroup(bannerGroup: CreateBannerGroupDto) {
    const group = {
      ...bannerGroup,
      user_subscribe: bannerGroup.user_subscribe ? JSON.stringify(bannerGroup.user_subscribe) : null,
    }

    const newGroup = this.bannerGroupRepository.create(group)
    return this.bannerGroupRepository.save(newGroup)
  }

  async updateBannerGroup(id: number, dto: UpdateBannerGroupDto) {
    return this.bannerGroupRepository.manager.transaction(async (manager) => {
      const bannerGroup = await manager.findOneBy(BannerGroupEntity, { id })
      if (isEmpty(bannerGroup)) {
        throw new BusinessException(ErrorEnum.REQUESTED_RESOURCE_NOT_FOUND)
      }

      if (bannerGroup.posters?.length)
        await Promise.all(bannerGroup.posters.map(item => Promise.resolve(manager.remove(item))))

      const posterEntityList = dto.posters.map(item => manager.create(PostsEntity, {
        url: encodeURIComponent(item.url),
        bannerGroup,
      }))

      const posterEntityPending = posterEntityList.map(item => Promise.resolve(this.postsRepository.save(item)))

      const result = await Promise.all(posterEntityPending)

      // console.log('a', posterEntityList, bannerGroup, result)

      bannerGroup.posters = result

      return bannerGroup.save()

      // return manager.update(BannerGroupEntity, id, {
      //   ...bannerGroup,
      //   user_subscribe: bannerGroup.user_subscribe ? JSON.stringify(bannerGroup.user_subscribe) : null,
      //   posters: posterEntityList,
      // })
    })
  }

  deleteBannerGroup(id: number) {
    return this.bannerGroupRepository.delete(id)
  }

  listBannerGroup({ page, pageSize }: BannerGroupQueryDto) {
    const queryBuilder = this.bannerGroupRepository.createQueryBuilder('bannerGroup')
      .leftJoinAndSelect('bannerGroup.posters', 'posters')

    return paginate<BannerGroupEntity>(queryBuilder, {
      page,
      pageSize,
    })
  }
}
