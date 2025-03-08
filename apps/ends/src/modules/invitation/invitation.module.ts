import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { InvitationController } from './invitation.controller'
import { InvitationRecordEntity } from './invitation.entity'
import { InvitationService } from './invitation.service'

const services = [InvitationService]

@Module({
  imports: [TypeOrmModule.forFeature([InvitationRecordEntity])],
  controllers: [InvitationController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class InvitationModule {}
