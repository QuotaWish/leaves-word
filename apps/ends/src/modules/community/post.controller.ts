import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { ApiResult } from '~/common/decorators/api-result.decorator'
import { IdParam } from '~/common/decorators/id-param.decorator'

import { Pagination } from '~/helper/paginate/pagination'
import { Perm, definePermission } from '~/modules/auth/decorators/permission.decorator'
import { Resource } from '~/modules/auth/decorators/resource.decorator'

import { ResourceGuard } from '~/modules/auth/guards/resource.guard'
import { PostEntity, PostRecordEntity } from '~/modules/community/post.entity'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { Public } from '../auth/decorators/public.decorator'

import { type PostDto, PostQueryDto } from './community.dto'
import { PostService } from './post.service'

export const permissions = definePermission('community', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Community模块')
@UseGuards(ResourceGuard)
@Controller('community')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('/published/posts')
  @ApiOperation({ summary: '获取已发版帖子列表' })
  @Public()
  @ApiResult({ type: [PostEntity], isPage: true })
  async publishedList(@Body() dto: PostQueryDto): Promise<Pagination<Partial<PostEntity> & { record: PostRecordEntity }>> {
    return this.postService.list(dto)
  }

  @Post('/list')
  @ApiOperation({ summary: '获取帖子列表' })
  @ApiResult({ type: [PostEntity] })
  @Perm(permissions.LIST)
  async list(@Body() dto: PostQueryDto): Promise<Pagination<PostEntity>> {
    return this.postService.adminList(dto)
  }

  @Get('/:id')
  @ApiOperation({ summary: '获取帖子详情' })
  @ApiResult({ type: PostEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<[PostEntity, PostRecordEntity]> {
    return this.postService.detail(id)
  }

  @Post()
  @ApiOperation({ summary: '创建帖子' })
  @Perm(permissions.CREATE)
  async create(@AuthUser() user: IAuthUser, @Body() dto: PostDto): Promise<PostEntity> {
    return this.postService.create(user, dto)
  }

  @Post('/temp_save')
  @ApiOperation({ summary: '临时保存', description: '用于用户编辑的时候去更新文档内容' })
  @Perm(permissions.CREATE)
  async tempSave(@Query('id') id: number, @AuthUser() user: IAuthUser, @Body() dto: PostDto): Promise<void> {
    return this.postService.tempSave(id, user, dto)
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新帖子' })
  @Perm(permissions.UPDATE)
  @Resource(PostEntity)
  async update(@IdParam() id: number, @AuthUser() user: IAuthUser, @Body() dto: PostDto): Promise<void> {
    return this.postService.update(id, user, dto)
  }

  @Delete('/:id')
  @ApiOperation({ summary: '归档帖子' })
  @Perm(permissions.DELETE)
  @Resource(PostEntity)
  async delete(@IdParam() id: number, @AuthUser() user: IAuthUser): Promise<boolean> {
    return this.postService.delete(id, user)
  }

  @Post('/publish/:id')
  @ApiOperation({ summary: '发版帖子' })
  @Perm(permissions.CREATE)
  @Resource(PostEntity)
  async publishVersion(@IdParam() id: number, @AuthUser() user: IAuthUser): Promise<boolean> {
    return this.postService.publishVersion(id, user)
  }
}
