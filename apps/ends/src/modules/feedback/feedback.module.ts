import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { FeedbackEntity } from './entities/feedback.entity'

import { FeedbackController } from './feedback.controller'
import { FeedbackService } from './feedback.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule { }
