import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SubscribeController } from './subscribe.controller'
import { SubscriptionPlanEntity } from './subscribe.entity'
import { SubscribeService } from './subscribe.service'

const services = [SubscribeService]

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlanEntity])],
  controllers: [SubscribeController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class SubscribeModule {}
