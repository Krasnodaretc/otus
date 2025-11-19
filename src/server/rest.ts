import http from 'http';
import { GameRegistry } from '../modules/GameEngine/Messaging/GameRegistry';
import { InboundMessageDTO, validateInboundMessageDTO } from '../modules/GameEngine/Messaging/types';
import { verifyAccessToken } from './auth';
import { createBattle } from '../modules/AuthClient';

export function createRestServer(registry: GameRegistry): http.Server {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/battles') {
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        const data = JSON.parse(raw) as unknown;
        const obj = data as { participants?: unknown };
        if (!Array.isArray(obj.participants) || obj.participants.length === 0) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'participants must be non-empty array' }));
          return;
        }
        const authUrl = process.env.AUTH_URL || 'http://localhost:4000';
        const { gameId } = await createBattle(authUrl, obj.participants as string[]);
        res.statusCode = 201;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ gameId }));
      } catch (e) {
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal error' }));
      }
      return;
    }
    if (req.method === 'POST' && req.url === '/messages') {
      try {
        const authHeader = req.headers['authorization'];
        if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
          res.statusCode = 401;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }
        const token = authHeader.slice(7);
        const claims = verifyAccessToken(token, process.env.AUTH_SECRET || 'dev-secret');
        if (!claims || claims.scope !== 'gameplay') {
          res.statusCode = 401;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        const data = JSON.parse(raw) as unknown as Partial<InboundMessageDTO>;
        const enriched: InboundMessageDTO = {
          gameId: String((data as any)?.gameId ?? ''),
          objectId: typeof (data as any)?.objectId === 'string' ? (data as any).objectId : undefined,
          operationId: String((data as any)?.operationId ?? ''),
          args: (data as any)?.args && typeof (data as any).args === 'object' ? ((data as any).args as Record<string, unknown>) : {},
          playerId: claims.sub,
        };
        if (!validateInboundMessageDTO(enriched)) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid payload' }));
          return;
        }
        const dto: InboundMessageDTO = enriched;
        if (claims.gameId !== dto.gameId) {
          res.statusCode = 403;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Forbidden' }));
          return;
        }
        registry.enqueueInterpret(dto);
        res.statusCode = 202;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ status: 'accepted' }));
      } catch (e) {
        res.statusCode = 500;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal error' }));
      }
      return;
    }

    res.statusCode = 404;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  });
  return server;
}


