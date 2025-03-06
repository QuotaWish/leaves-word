import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LiveChatController } from './livechat.controller'
import { LiveChatEntity } from './livechat.entity'
import { LiveChatservice } from './livechat.service'

@Module({
  imports: [TypeOrmModule.forFeature([LiveChatEntity])],
  controllers: [LiveChatController],
  providers: [LiveChatservice],
})
export class LivechatModule {
}
