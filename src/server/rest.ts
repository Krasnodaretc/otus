import http from 'http';
import { GameRegistry } from '../modules/GameEngine/Messaging/GameRegistry';
import { InboundMessageDTO, validateInboundMessageDTO } from '../modules/GameEngine/Messaging/types';

export function createRestServer(registry: GameRegistry): http.Server {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/messages') {
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        const data = JSON.parse(raw) as unknown;
        if (!validateInboundMessageDTO(data)) {
          res.statusCode = 400;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid payload' }));
          return;
        }
        const dto: InboundMessageDTO = data;
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


