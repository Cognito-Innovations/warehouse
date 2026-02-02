export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenExpiredInfo {
  name: 'TokenExpiredError';
  message: string;
}
