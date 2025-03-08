import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { BannerController } from './banner.controller'

import { BannerGroupEntity, PostsEntity } from './banner.entity'

import { BannerService } from './banner.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([BannerGroupEntity, PostsEntity]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})

export class BannerModule { }
