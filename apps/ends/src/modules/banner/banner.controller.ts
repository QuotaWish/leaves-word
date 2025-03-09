import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { BannerGroupQueryDto, CreateBannerGroupDto, UpdateBannerGroupDto } from './banner.dto'
import { BannerService } from './banner.service'

@ApiTags('广告设置')
  @Controller('marketing/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  @Post()
  @ApiOperation({ summary: '创建广告组' })
  create(@Body() group: CreateBannerGroupDto) {
    console.log('group', group)
    return this.bannerService.createBannerGroup(group)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新广告组' })
  update(@Param('id') id: string, @Body() group: UpdateBannerGroupDto) {
    console.log('group', group)
    return this.bannerService.updateBannerGroup(Number(id), group)
  }

  @Get('list')
  @ApiOperation({ summary: '获取列表' })
  list(@Query() query: BannerGroupQueryDto) {
    return this.bannerService.listBannerGroup(query)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除广告组' })
  delete(@Param('id') id: number) {
    return this.bannerService.deleteBannerGroup(id)
  }
}
