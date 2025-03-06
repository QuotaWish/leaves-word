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
import { AiGcModule } from './modules/aigc/aigc.module'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'
import { BannerModule } from './modules/banner/banner.module'
import { PostModule } from './modules/community/post.module'
import { CouponModule } from './modules/coupon/coupon.module'
import { DocModule } from './modules/document/doc.module'
import { DummyModule } from './modules/dummy/dummy.module'
import { FeedbackModule } from './modules/feedback/feedback.module'
import { HealthModule } from './modules/health/health.module'
import { InvitationModule } from './modules/invitation/invitation.module'
import { LivechatModule } from './modules/livechat/livechat.module'
import { NetdiskModule } from './modules/netdisk/netdisk.module'
import { OrderModule } from './modules/order/order.module'
import { PlatformModule } from './modules/platform/platform.module'
import { SseModule } from './modules/sse/sse.module'
import { SubscribeModule } from './modules/subscribe/subscribe.module'
import { SystemModule } from './modules/system/system.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TodoModule } from './modules/todo/todo.module'
import { ToolsModule } from './modules/tools/tools.module'
import { UserConfigModule } from './modules/user-config/user-config.module'
import { DatabaseModule } from './shared/database/database.module'

import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 避免暴力请求，限制同一个接口 1 秒内不能超过 12 次请求
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [
          { ttl: seconds(1), limit: 12 },
        ],
      }),
    }),
    // 启用 CLS 上下文
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
    AiGcModule,
    DocModule,
    DummyModule,
    PlatformModule,
    OrderModule,
    SubscribeModule,
    CouponModule,
    InvitationModule,
    FeedbackModule,
    PostModule,

    UserConfigModule,
    BannerModule,
    LivechatModule,
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
