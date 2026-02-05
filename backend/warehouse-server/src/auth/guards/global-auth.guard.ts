import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload, TokenExpiredInfo } from '../interfaces/jwt.types';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | any {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: unknown,
    user: TUser | null,
    info: TokenExpiredInfo | undefined,
    context: ExecutionContext,
  ): TUser {
    if (user) {
      return user;
    }

    if (info?.name === 'TokenExpiredError') {
      const req = context.switchToHttp().getRequest<Request>();
      const res = context.switchToHttp().getResponse<Response>();

      const authHeader = req.headers.authorization;
      const tokenFromHeader = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;

      const tokenFromCookie =
        typeof req.cookies === 'object'
          ? (req.cookies['jwt-token'] as string | undefined)
          : undefined;

      const token = tokenFromHeader ?? tokenFromCookie;

      if (!token) {
        throw new UnauthorizedException();
      }

      const decoded = this.jwtService.decode(token);

      if (
        !decoded ||
        typeof decoded !== 'object' ||
        !('sub' in decoded) ||
        !('email' in decoded)
      ) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = {
        sub: decoded.sub as string,
        email: decoded.email as string,
      };

      const newAccessToken = this.jwtService.sign(payload);

      res.setHeader('x-access-token', newAccessToken);
      req.headers.authorization = `Bearer ${newAccessToken}`;

      return payload as unknown as TUser;
    }

    throw new UnauthorizedException(
      'You are not authorized to make this request',
    );
  }
}
