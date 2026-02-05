import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    const user = req.user as { id?: string } | undefined;

    if (user?.id) {
      return user.id;
    }

    const clientId = req.headers['x-client-identifier'];
    if (typeof clientId === 'string' && clientId.length > 0) {
      return `client-${clientId}`;
    }

    const ip = req.ip ?? 'unknown-ip';
    return ip;
  }
}
