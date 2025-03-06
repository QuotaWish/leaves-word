import { Injectable } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { Repository } from 'typeorm'

import {
  decodeText,
  encodeText,
} from '~/utils'

import { CreateUserConfigDto } from './dto/create-user-config.dto'

import { UserConfigEntity } from './entities/user-config.entity'

@Injectable()
export class UserConfigService {
  constructor(
    @InjectRepository(UserConfigEntity) private readonly UserConfigRepository: Repository<UserConfigEntity>,

  ) {

  }

  async updateConfig(user: IAuthUser, createUserConfigDto: CreateUserConfigDto) {
    const { pri_info, pub_info } = createUserConfigDto

    // 创建config 如果存在就更新
    let userConfig = await this.UserConfigRepository.findOne({
      where: {
        user: { id: user.uid },
      },
    })

    if (isEmpty(userConfig)) {
      userConfig = this.UserConfigRepository.create({
        pri_info: encodeText(pri_info),
        pub_info: encodeText(pub_info),
        user: { id: user.uid },
      })
    }
    else {
      userConfig.pri_info = encodeText(pri_info)
      userConfig.pub_info = encodeText(pub_info)
    }

    return userConfig.save()
  }

  async getByUserForPublic(id: number) {
    const res = await this.getByUser(id)

    if (isEmpty(res)) {
      return null
    }

    delete res.pri_info

    return res
  }

  async getByUser(id: number) {
    const res = await this.UserConfigRepository.findOne({
      where: {
        user: {
          id,
        },
      },
      relations: ['user'],
    })

    if (isEmpty(res))
      return null

    res.pri_info = decodeText(res.pri_info)
    res.pub_info = decodeText(res.pub_info)

    return res
  }
}
