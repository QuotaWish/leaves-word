import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

let logger: Logger | null

export const getLogger = () => logger!

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle()
    const request = context.switchToHttp().getRequest()
    const content = `${request.method} -> ${request.url}`
    const isSse = request.headers.accept === 'text/event-stream'
    logger.debug(`+++ 请求：${content}`)
    const now = Date.now()

    return call$.pipe(
      tap(() => {
        if (isSse)
          return

        logger.debug(`--- 响应：${content}${` +${Date.now() - now}ms`}`)
      },
      ),
    )
  }
}

logger = new Logger(LoggingInterceptor.name, { timestamp: false })
