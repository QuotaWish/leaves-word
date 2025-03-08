import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AigcController } from './aigc.controller'
import { AiGcEntity, ChatMessage, ChatMsgLogEntity, ChatShareMessage, PromptAuditEntity, PromptEntity, PromptTagEntity } from './aigc.entity'
import { AiGcService } from './aigc.service'

const services = [AiGcService]

@Module({
  imports: [TypeOrmModule.forFeature([AiGcEntity, ChatShareMessage, ChatMessage, ChatMsgLogEntity, PromptEntity, PromptAuditEntity, PromptTagEntity])],
  controllers: [AigcController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class AiGcModule {}
