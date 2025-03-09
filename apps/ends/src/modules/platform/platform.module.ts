import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthService } from '../auth/auth.service'
import { TokenService } from '../auth/services/token.service'
import { SseService } from '../sse/sse.service'
import { LoginLogEntity } from '../system/log/entities/login-log.entity'
import { LoginLogService } from '../system/log/services/login-log.service'
import { MenuEntity } from '../system/menu/menu.entity'
import { MenuService } from '../system/menu/menu.service'
import { ParamConfigEntity } from '../system/param-config/param-config.entity'
import { ParamConfigService } from '../system/param-config/param-config.service'
import { RoleEntity } from '../system/role/role.entity'
import { RoleService } from '../system/role/role.service'
import { UserEntity } from '../user/user.entity'
import { UserService } from '../user/user.service'

import { PlatformController } from './platform.controller'
import { ThirdPartyBindingEntity } from './platform.entity'
import { PlatformService } from './platform.service'

const services = [PlatformService, UserService, ParamConfigService, MenuService, RoleService, SseService, AuthService, LoginLogService, TokenService, JwtService]

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyBindingEntity, UserEntity, RoleEntity, ParamConfigEntity, MenuEntity, MenuEntity, LoginLogEntity])],
  controllers: [PlatformController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class PlatformModule {}
