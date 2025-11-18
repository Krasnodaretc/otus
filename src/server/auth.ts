import jwt from 'jsonwebtoken';

export type AccessTokenClaims = {
  sub: string;
  gameId: string;
  scope: string;
  iss?: string;
  iat?: number;
  exp?: number;
};

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


