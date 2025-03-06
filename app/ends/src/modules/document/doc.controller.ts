import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { DocProtocolEntity, type DocRecordEntity, DocumentEntity } from '~/modules/document/doc.entity'

import { AuthUser } from '../auth/decorators/auth-user.decorator'

import { Public } from '../auth/decorators/public.decorator'

import { DocDto, DocQueryDto } from './doc.dto'
import { DocService } from './doc.service'

export const permissions = definePermission('doc', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const)

@ApiTags('Business - Document模块')
@UseGuards(ResourceGuard)
@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) { }

  @Post('/published/list')
  @ApiOperation({ summary: '获取已发版Doc列表' })
  @Public()
  @ApiResult({ type: [DocumentEntity], isPage: true })
  async publishedList(@Body() dto: DocQueryDto): Promise<Pagination<Partial<DocumentEntity> & { record: DocRecordEntity }>> {
    return this.docService.list(dto)
  }

  @Post('/list')
  @ApiOperation({ summary: '获取Doc列表' })
  @ApiResult({ type: [DocumentEntity] })
  @Perm(permissions.LIST)
  async list(@Body() dto: DocQueryDto): Promise<Pagination<DocumentEntity>> {
    return this.docService.adminList(dto)
  }

  @Get('/:id')
  @ApiOperation({ summary: '获取Doc详情' })
  @ApiResult({ type: DocumentEntity })
  @Perm(permissions.READ)
  async info(@IdParam() id: number): Promise<[DocumentEntity, DocRecordEntity]> {
    return this.docService.detail(id)
  }

  @Post()
  @ApiOperation({ summary: '创建Doc' })
  @Perm(permissions.CREATE)
  async create(@AuthUser() user: IAuthUser, @Body() dto: DocDto): Promise<DocumentEntity> {
    return this.docService.create(user, dto)
  }

  @Post('/temp_save')
  @ApiOperation({ summary: '临时保存', description: '用于用户编辑的时候去更新文档内容' })
  @Perm(permissions.CREATE)
  async tempSave(@Query('id') id: number, @AuthUser() user: IAuthUser, @Body() dto: DocDto): Promise<void> {
    return this.docService.tempSave(id, user, dto)
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新Doc' })
  @Perm(permissions.UPDATE)
  @Resource(DocumentEntity)
  async update(@IdParam() id: number, @AuthUser() user: IAuthUser, @Body() dto: DocDto): Promise<void> {
    return this.docService.update(id, user, dto)
  }

  @Delete('/:id')
  @ApiOperation({ summary: '归档Doc' })
  @Perm(permissions.DELETE)
  @Resource(DocumentEntity)
  async delete(@IdParam() id: number, @AuthUser() user: IAuthUser): Promise<boolean> {
    return this.docService.delete(id, user)
  }

  @Post('/publish/:id')
  @ApiOperation({ summary: '发版Doc' })
  @Perm(permissions.CREATE)
  @Resource(DocumentEntity)
  async publishVersion(@IdParam() id: number, @AuthUser() user: IAuthUser): Promise<boolean> {
    return this.docService.publishVersion(id, user)
  }

  @Post('/agreement/:id')
  @ApiOperation({ summary: '将某个doc设置为协议' })
  @Perm(permissions.UPDATE)
  @Resource(DocProtocolEntity)
  async setAgreement(@Query('key') key: string, @IdParam() id: number, @AuthUser() user: IAuthUser): Promise<DocProtocolEntity> {
    return this.docService.setAgreement(key, id, user)
  }

  @Get('/agreement/:key')
  @ApiOperation({ summary: '获取某个协议' })
  @Public()
  @ApiResult({ type: DocProtocolEntity })
  async getAgreement(@Param('key') key: string): Promise<any> {
    return this.docService.getAgreementByKey(key)
  }
}
