import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DocController } from './doc.controller'
import { DocProtocolEntity, DocRecordEntity, DocumentEntity } from './doc.entity'
import { DocService } from './doc.service'

const services = [DocService]

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity, DocRecordEntity, DocProtocolEntity])],
  controllers: [DocController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class DocModule {}
