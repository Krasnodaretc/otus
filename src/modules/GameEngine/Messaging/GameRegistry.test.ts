import { GameRegistry } from './GameRegistry';

class MockWorkerClient {
	start = jest.fn(async () => {});
	startGame = jest.fn(() => {});
	onState = jest.fn(() => {});
	enqueueInterpret = jest.fn(() => {});
}

jest.mock('../../GameEngine/Commands/thread/WorkerClient', () => {
	return {
		WorkerClient: jest.fn().mockImplementation(() => new MockWorkerClient()),
	};
});

test('enqueueInterpret ensures worker and forwards dto', async () => {
	const registry = new GameRegistry();
	const dto = { gameId: 'g1', objectId: 'o1', operationId: 'op', args: {} } as any;

	registry.enqueueInterpret(dto);
	await Promise.resolve();

	const { WorkerClient } = require('../../GameEngine/Commands/thread/WorkerClient');
	const instance = (WorkerClient as jest.Mock).mock.results[0].value as MockWorkerClient;

	expect(WorkerClient).toHaveBeenCalledTimes(1);
	expect(instance.start).toHaveBeenCalled();
	expect(instance.startGame).toHaveBeenCalledWith('g1');
	expect(instance.enqueueInterpret).toHaveBeenCalledWith(dto);
});
