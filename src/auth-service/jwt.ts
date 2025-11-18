import jwt from 'jsonwebtoken';

export type AccessTokenClaims = {
  sub: string;
  gameId: string;
  scope: string;
  iss?: string;
  iat?: number;
  exp?: number;
};

export function signAccessToken(userId: string, gameId: string, secret: string): string {
  const payload: AccessTokenClaims = {
    sub: userId,
    gameId,
    scope: 'gameplay',
  };
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
    issuer: 'auth-service',
  });
}

export function verifyAccessToken(token: string, secret: string): AccessTokenClaims | null {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'auth-service',
    }) as AccessTokenClaims;
    return decoded;
  } catch {
    return null;
  }
}


