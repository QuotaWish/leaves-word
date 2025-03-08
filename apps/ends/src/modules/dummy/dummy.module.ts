import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DummyController } from './dummy.controller'
import { LotteryEntity, LotteryRecordEntity, PointsSummaryEntity, PointsTransactionEntity } from './dummy.entity'
import { DummyService } from './dummy.service'

const services = [DummyService]

@Module({
  imports: [TypeOrmModule.forFeature([LotteryEntity, LotteryRecordEntity, PointsSummaryEntity, PointsTransactionEntity])],
  controllers: [DummyController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class DummyModule {}
