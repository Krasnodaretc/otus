import { createServer, Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GameRegistry } from '../modules/GameEngine/Messaging/GameRegistry';

type Subscription = {
  socket: WebSocket;
  gameId: string;
};

export function createWsServer(registry: GameRegistry, httpServer?: HttpServer): { wss: WebSocketServer; server: HttpServer } {
  const server = httpServer ?? createServer();
  const wss = new WebSocketServer({ server, path: '/ws' });

  const subs = new Set<Subscription>();

  wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg && msg.type === 'subscribe' && typeof msg.gameId === 'string') {
          subs.add({ socket, gameId: msg.gameId });
          socket.send(JSON.stringify({ type: 'subscribed', gameId: msg.gameId }));
        }
      } catch {}
    });
    socket.on('close', () => {
      for (const s of Array.from(subs)) {
        if (s.socket === socket) subs.delete(s);
      }
    });
  });

  registry.on('state', ({ gameId, snapshot }) => {
    const payload = JSON.stringify({ type: 'state', gameId, snapshot });
    for (const s of subs) {
      if (s.gameId === gameId && s.socket.readyState === WebSocket.OPEN) {
        s.socket.send(payload);
      }
    }
  });

  return { wss, server };
}


