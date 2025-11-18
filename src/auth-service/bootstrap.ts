import { BattleStorage } from './storage';
import { createAuthServer } from './server';

export async function bootstrap(): Promise<void> {
  const storage = new BattleStorage();
  const server = createAuthServer(storage);
  const port = process.env.AUTH_PORT ? Number(process.env.AUTH_PORT) : 4000;
  server.listen(port);
}

if (require.main === module) {
  void bootstrap();
}


