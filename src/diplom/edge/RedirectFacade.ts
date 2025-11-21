import { RequestContext, ResponseResult } from './pipeline/types';
import { Handler } from './pipeline/Handler';

export class RedirectFacade {
  constructor(private readonly handler: Handler) {}

  async handle(ctx: RequestContext): Promise<ResponseResult> {
    const res: ResponseResult = { status: 200 };
    await this.handler.handle(ctx, res);

    return res;
  }
}


