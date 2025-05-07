import cluster from 'node:cluster'
import path from 'node:path'

import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestFastifyApplication } from '@nestjs/platform-fastify'

import { useContainer } from 'class-validator'

import { AppModule } from './app.module'

import { fastifyApp } from './common/adapters/fastify.adapter'
import { RedisIoAdapter } from './common/adapters/socket.adapter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import type { ConfigKeyPaths } from './config'
import { isDev, isMainProcess } from './global/env'
import { setupSwagger } from './setup-swagger'
import { LoggerService } from './shared/logger/logger.service'

declare const module: { hot: { accept: () => void; dispose: (fn: () => void) => void } }

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyApp,
    {
      rawBody: true,
      bufferLogs: true,
      snapshot: true,
      // forceCloseConnections: true,
    },
  )

  const configService = app.get(ConfigService<ConfigKeyPaths>)

  const { port, globalPrefix } = configService.get('app', { infer: true })

  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableCors({
    origin: ['https://ai.quotawish.com', 'https://dev.quotawish.com', 'https://quotawish.com', 'https://devpage.quotawish.com', 'http://localhost:3000', 'http://localhost:3333'],
    maxAge: 3600,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['X-File-Type', 'X-File-Name', 'X-Requested-By', 'X-Requested-With', 'X-File-Size', 'User-Agent', 'Cache-Control', 'Cache-Type', 'Authorization', 'Content-Type', 'X-Requested-With', 'X-Auth-Token', 'Access-Control-Allow-Headers', 'Origin', 'Accept', 'X-Requested-With', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
  })
  app.setGlobalPrefix(globalPrefix)
  app.useStaticAssets({ root: path.join(__dirname, '..', 'public') })
  // Starts listening for shutdown hooks
  !isDev && app.enableShutdownHooks()

  if (isDev)
    app.useGlobalInterceptors(new LoggingInterceptor())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      // forbidNonWhitelisted: true, // 禁止 无装饰器验证的数据通过
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: errors =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0]
            const msg = e.constraints![rule]
            return msg
          })[0],
        ),
    }),
  )

  app.useWebSocketAdapter(new RedisIoAdapter(app))

  setupSwagger(app, configService)

  await app.listen(port, '0.0.0.0', async () => {
    app.useLogger(app.get(LoggerService))
    const url = await app.getUrl()
    const { pid } = process
    const env = cluster.isPrimary
    const prefix = env ? 'P' : 'W'

    if (!isMainProcess)
      return

    const logger = new Logger('LeavesWord')
    logger.log(`[${prefix + pid}] Server running on ${url}`)

    if (isDev)
      logger.log(`[${prefix + pid}] OpenAPI: ${url}/api-docs`)
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}

bootstrap()
