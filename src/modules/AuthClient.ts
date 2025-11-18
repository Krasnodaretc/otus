import http from 'http';
import https from 'https';

export type CreateBattleResponse = { gameId: string };

export async function createBattle(authBaseUrl: string, participants: string[]): Promise<CreateBattleResponse> {
  if (!Array.isArray(participants) || participants.length === 0) {
    throw new Error('participants must be a non-empty array');
  }
  const url = new URL('/battles', authBaseUrl);
  const body = JSON.stringify({ participants });
  const isHttps = url.protocol === 'https:';
  const agent = isHttps ? https : http;
  const options: https.RequestOptions = {
    hostname: url.hostname,
    port: url.port ? Number(url.port) : isHttps ? 443 : 80,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    },
  };
  return new Promise<CreateBattleResponse>((resolve, reject) => {
    const req = agent.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(raw) as unknown;
            const obj = parsed as { gameId?: unknown };
            if (typeof obj.gameId !== 'string') {
              reject(new Error('invalid response'));
              return;
            }
            resolve({ gameId: obj.gameId });
          } else {
            reject(new Error(`request failed: ${res.statusCode}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}


