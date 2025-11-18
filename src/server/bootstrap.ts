import { GameRegistry } from '../modules/GameEngine/Messaging/GameRegistry';
import { createRestServer } from './rest';
import { createWsServer } from './ws';

export async function bootstrap(): Promise<void> {
  const registry = new GameRegistry();
  const rest = createRestServer(registry);
  const { server } = createWsServer(registry, rest);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  server.listen(port);
}

if (require.main === module) {
  void bootstrap();
}


