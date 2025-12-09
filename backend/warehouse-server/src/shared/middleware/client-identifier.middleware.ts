import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClientIdentifierService } from '../client-identifier.service';

@Injectable()
export class ClientIdentifierMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ClientIdentifierMiddleware.name);

  constructor(
    private readonly clientIdentifierService: ClientIdentifierService,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = this.extractClientIp(req);

      if (ipAddress) {
        const identifier =
          await this.clientIdentifierService.resolveClientIdentifier(ipAddress);
        (req as Request & { clientIdentifierId?: string }).clientIdentifierId =
          identifier;
      } else {
        this.logger.warn('Could not determine client IP address for request');
      }
    } catch (error) {
      this.logger.error(
        'Failed to resolve client identifier',
        error instanceof Error ? error.stack : String(error),
      );
    } finally {
      next();
    }
  }

  private extractClientIp(req: Request): string | null {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const candidates: Array<string | undefined> = [];

    if (Array.isArray(xForwardedFor)) {
      candidates.push(...xForwardedFor);
    } else if (typeof xForwardedFor === 'string') {
      candidates.push(...xForwardedFor.split(',').map((ip) => ip.trim()));
    }

    candidates.push(req.socket.remoteAddress);
    candidates.push((req as { ip?: string }).ip);

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }

      const cleaned = this.normalizeIp(candidate);
      if (cleaned) {
        return cleaned;
      }
    }

    return null;
  }

  private normalizeIp(ip: string): string {
    let value = ip.trim();

    if (!value) {
      return '';
    }

    if (value.startsWith('::ffff:')) {
      value = value.substring(7);
    }

    if (value === '::1') {
      return '127.0.0.1';
    }

    return value;
  }
}
