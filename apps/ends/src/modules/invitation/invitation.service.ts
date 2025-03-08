import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmpty } from 'lodash'
import { Repository } from 'typeorm'

import { $event } from '~/common/eventbus/init'
import { BusinessException } from '~/common/exceptions/biz.exception'

import { getLogger } from '~/common/interceptors/logging.interceptor'

import { UserEntity } from '../user/user.entity'

import { InvitationRecordEntity } from './invitation.entity'

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationRecordEntity)
    private invitationRecordRepository: Repository<InvitationRecordEntity>,
  ) { }

  getUserInvitationRecords(uid: number) {
    return this.invitationRecordRepository.find({
      where: {
        inviteUser: {
          id: uid,
        },
      },
      relations: ['inviteUser', 'user'],
      select: {
        user: {
          id: true,
          username: true,
          avatar: true,
          nickname: true,
          remark: true,
        },
        inviteUser: {
          id: true,
          username: true,
          avatar: true,
          nickname: true,
          remark: true,
        },
      },
    })
  }

  async canUserBeInvited(userId: number) {
    const result = await this.invitationRecordRepository.findOneBy({
      user: {
        id: userId,
      },
    })

    return isEmpty(result)
  }

  // 接受用户邀请
  async acceptInvitation(invitationId: number, userId: number, source: string) {
    if (!await this.canUserBeInvited(userId)) {
      throw new BusinessException('用户已被邀请过')
    }

    await this.invitationRecordRepository.manager.transaction(async (manager) => {
      // get target user
      const targetUser = await manager.findOneBy(UserEntity, {
        id: invitationId,
      })

      if (isEmpty(targetUser)) {
        throw new BusinessException('邀请用户不存在')
      }

      const record = await manager.findOneBy(InvitationRecordEntity, {
        user: {
          id: invitationId,
        },
        inviteUser: {
          id: userId,
        },
      })

      if (!isEmpty(record)) {
        throw new BusinessException('无法相互邀请')
      }

      const invitation = this.invitationRecordRepository.create({
        inviteUser: {
          id: invitationId,
        },
        user: {
          id: userId,
        },
        source,
      })

      await manager.save(invitation)

      $event.emit('USER_INVITATION_SUCCESS', targetUser, userId, source)

      getLogger().log(`[Invitation] ${userId} 邀请了 ${invitationId} # ${source} / EventEmitted.`)
    })

    return true
  }
}
