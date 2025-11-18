import { FireCommand } from './FireCommand';

test('FireCommand invokes action', () => {
  const fn = jest.fn();
  const cmd = new FireCommand(fn);
  cmd.execute();
  expect(fn).toHaveBeenCalledTimes(1);
});


