import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

export const jwtExtractor = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  (req: Request): string | null => {
    const cookies = req.headers?.cookie;
    if (!cookies) return null;

    const token = cookies
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('jwt-token=') || c.startsWith('auth-token='));

    return token ? token.split('=')[1] : null;
  },
]);
