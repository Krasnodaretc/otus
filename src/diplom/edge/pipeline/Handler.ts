import { RequestContext, ResponseResult } from './types';

export interface Handler {
  setNext(next: Handler): Handler;
  handle(ctx: RequestContext, res: ResponseResult): Promise<void>;
}

export abstract class BaseHandler implements Handler {
  private nextHandler?: Handler;
  setNext(next: Handler): Handler {
    this.nextHandler = next;

    return next;
  }

  async handle(ctx: RequestContext, res: ResponseResult): Promise<void> {
    await this.process(ctx, res);

    if (this.nextHandler && res.status < 300) {
      await this.nextHandler.handle(ctx, res);
    }
  }

  protected abstract process(ctx: RequestContext, res: ResponseResult): Promise<void> | void;
}


