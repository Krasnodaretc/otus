import { SetVelocityCommand } from './SetVelocityCommand';

test('SetVelocityCommand sets velocity on target', () => {
  const target = {
    setVelocity: jest.fn(),
  } as any;
  const cmd = new SetVelocityCommand(target, { x: 3, y: 4 });
  cmd.execute();
  expect(target.setVelocity).toHaveBeenCalledWith({ x: 3, y: 4 });
});


