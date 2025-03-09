import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostController } from './post.controller'
import { PostEntity, PostRecordEntity } from './post.entity'
import { PostService } from './post.service'

const services = [PostService]

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostRecordEntity])],
  controllers: [PostController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class PostModule {}
