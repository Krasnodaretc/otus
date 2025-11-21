import { BaseHandler } from './Handler';
import { RequestContext, ResponseResult } from './types';

class RecordingHandler extends BaseHandler {
  calls: Array<{ ctx: RequestContext; res: ResponseResult }> = [];
  protected async process(ctx: RequestContext, res: ResponseResult) {
    this.calls.push({ ctx, res });
  }
}

class StatusHandler extends BaseHandler {
  constructor(private readonly code: number) {
    super();
  }
  protected process(_ctx: RequestContext, res: ResponseResult) {
    res.status = this.code;
  }
}

describe('BaseHandler chain', () => {
  it('calls next when status is below 300', async () => {
    const first = new RecordingHandler();
    const second = new RecordingHandler();
    first.setNext(second);
    const ctx: RequestContext = {} as any;
    const res: ResponseResult = { status: 200 };

    await first.handle(ctx, res);

    expect(first.calls.length).toBe(1);
    expect(second.calls.length).toBe(1);
  });

  it('does not call next when status is 300 or above', async () => {
    const first = new StatusHandler(400);
    const second = new RecordingHandler();
    first.setNext(second);
    const ctx: RequestContext = {} as any;
    const res: ResponseResult = { status: 200 };

    await first.handle(ctx, res);

    expect(res.status).toBe(400);
    expect(second.calls.length).toBe(0);
  });

  it('runs without next handler', async () => {
    const single = new RecordingHandler();
    const ctx: RequestContext = {} as any;
    const res: ResponseResult = { status: 200 };

    await single.handle(ctx, res);

    expect(single.calls.length).toBe(1);
  });

  it('setNext returns the next handler', () => {
    const first = new RecordingHandler();
    const second = new RecordingHandler();

    const returned = first.setNext(second);

    expect(returned).toBe(second);
  });
});



