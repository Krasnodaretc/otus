import http from 'http';
import { BattleStorage } from './storage';
import { signAccessToken } from './jwt';

function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => {
      try {
        if (chunks.length === 0) {
          resolve({});
          return;
        }
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(JSON.parse(raw) as unknown);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export function createAuthServer(storage: BattleStorage): http.Server {
  const server = http.createServer(async (req, res) => {
    res.setHeader('content-type', 'application/json');
    try {
      if (req.method === 'POST' && req.url === '/battles') {
        const body = (await readJsonBody(req)) as { participants?: unknown };
        if (!Array.isArray(body.participants)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'participants must be array' }));
          return;
        }
        try {
          const gameId = storage.createBattle(body.participants as string[]);
          res.statusCode = 201;
          res.end(JSON.stringify({ gameId }));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: (e as Error).message }));
        }
        return;
      }

      if (req.method === 'POST' && req.url === '/token') {
        const userIdHeader = req.headers['x-user-id'];
        const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
        if (typeof userId !== 'string' || userId.trim() === '') {
          res.statusCode = 401;
          res.end(JSON.stringify({ error: 'missing user id' }));
          return;
        }
        const body = (await readJsonBody(req)) as { gameId?: unknown };
        if (typeof body.gameId !== 'string' || body.gameId.trim() === '') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'gameId is required' }));
          return;
        }
        if (!storage.hasParticipant(body.gameId, userId)) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: 'forbidden' }));
          return;
        }
        const secret = process.env.AUTH_SECRET || 'dev-secret';
        const token = signAccessToken(userId, body.gameId, secret);
        res.statusCode = 200;
        res.end(JSON.stringify({ token }));
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal error' }));
    }
  });
  return server;
}


