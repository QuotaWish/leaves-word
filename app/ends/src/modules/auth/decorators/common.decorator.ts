import { ExecutionContext, createParamDecorator } from '@nestjs/common'

/**
 * @description 获取当前登录用户信息, 并挂载到request上
 */
export const AliCaptcha = createParamDecorator(
  async (scene: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<any>()
    // auth guard will mount this
    const param = request.param

    const [access, reason] = await AliCaptcha.validate(param, scene)

    if (!access) {
      return {
        access,
        reason,
      }
    }

    return ctx
  },
)
