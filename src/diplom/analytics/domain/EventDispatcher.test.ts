import { EventDispatcher } from './EventDispatcher';

describe('EventDispatcher', () => {
  it('dispatches only to matching handlers', async () => {
    const called: string[] = [];
    const d = new EventDispatcher();

    d.register({ canHandle: (e) => e.type === 'a', handle: async () => { called.push('a'); } });
    d.register({ canHandle: (e) => e.type === 'b', handle: async () => { called.push('b'); } });
    await d.dispatch({ type: 'a' });
    expect(called).toEqual(['a']);
  });
});


