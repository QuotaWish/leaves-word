import { ClassSerializerInterceptor, Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler'
import { FastifyRequest } from 'fastify'
import { ClsModule } from 'nestjs-cls'

import config from '~/config'
import { SharedModule } from '~/shared/shared.module'

import { AllExceptionsFilter } from './common/filters/any-exception.filter'

import { IdempotenceInterceptor } from './common/interceptors/idempotence.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'
import { HealthModule } from './modules/health/health.module'
import { NetdiskModule } from './modules/netdisk/netdisk.module'
import { PlatformModule } from './modules/platform/platform.module'
import { SseModule } from './modules/sse/sse.module'
import { SystemModule } from './modules/system/system.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TodoModule } from './modules/todo/todo.module'
import { ToolsModule } from './modules/tools/tools.module'
import { UserConfigModule } from './modules/user-config/user-config.module'
import { DatabaseModule } from './shared/database/database.module'

import { SocketModule } from './socket/socket.module'
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [
          { ttl: seconds(1), limit: 12 },
        ],
      }),
    }),
    ClsModule.forRoot({
      global: true,
      // https://github.com/Papooch/nestjs-cls/issues/92
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
          if (req.params?.id && req.body) {
            // 供自定义参数验证器(UniqueConstraint)使用
            cls.set('operateId', Number.parseInt(req.params.id))
          }
        },
      },
    }),
    // ElasticsearchModule.registerAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get<string>('ELASTICSEARCH_NODE'),
    //     auth: {
    //       username: configService.get('ELASTICSEARCH_USERNAME'),
    //       password: configService.get('ELASTICSEARCH_PASSWORD'),
    //     },
    //     tls: {
    //       rejectUnauthorized: false,
    //     },
    //     maxRetries: configService.get('ELASTICSEARCH_MAX_RETRIES'),
    //     requestTimeout: configService.get('ELASTICSEARCH_REQ_TIMEOUT'),
    //   }),
    //   inject: [ConfigService],
    // }),
    SharedModule,
    DatabaseModule,
    // SearchModule,

    AuthModule,
    SystemModule,
    TasksModule.forRoot(),
    ToolsModule,
    SocketModule,
    HealthModule,
    SseModule,
    NetdiskModule,

    // biz

    // end biz

    TodoModule,
    PlatformModule,

    UserConfigModule,
    PrismaModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
    { provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },

  ],
})
export class AppModule { }
