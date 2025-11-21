import { RequestContext, ResponseResult } from './pipeline/types';
import { Handler } from './pipeline/Handler';
export class RedirectFacade {
  private readonly root: Handler;
  constructor(root: Handler) {
    this.root = root;
  }
  async handle(ctx: RequestContext): Promise<ResponseResult> {
    const res: ResponseResult = { status: 200 };
    await this.root.handle(ctx, res);
    return res;
  }
}


