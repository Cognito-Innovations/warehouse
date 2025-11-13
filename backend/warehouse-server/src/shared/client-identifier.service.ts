import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ClientIdentifier } from './entities';

@Injectable()
export class ClientIdentifierService {
  private readonly logger = new Logger(ClientIdentifierService.name);

  constructor(
    @InjectRepository(ClientIdentifier)
    private readonly clientIdentifierRepository: Repository<ClientIdentifier>,
  ) {}

  async resolveClientIdentifier(ipAddress: string): Promise<string> {
    const normalizedIp = this.normalizeIp(ipAddress);

    let record = await this.clientIdentifierRepository.findOne({
      where: { ip_address: normalizedIp },
    });

    if (record) {
      return record.id;
    }

    const identifier = this.generateIdentifier();
    record = this.clientIdentifierRepository.create({
      id: identifier,
      ip_address: normalizedIp,
    });

    try {
      await this.clientIdentifierRepository.save(record);
      return record.id;
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        const existing = await this.clientIdentifierRepository.findOne({
          where: { ip_address: normalizedIp },
        });
        if (existing) {
          return existing.id;
        }
      }

      this.logger.error(
        `Failed to persist client identifier for IP address ${normalizedIp}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  private generateIdentifier(): string {
    return `AUTH-${new Date().getFullYear()}-${randomUUID()}`;
  }

  private normalizeIp(ipAddress: string): string {
    let ip = ipAddress.trim();
    if (!ip) {
      return 'unknown';
    }

    const firstIpInList = ip.split(',')[0]?.trim() ?? ip;
    ip = firstIpInList;

    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    if (ip === '::1') {
      return '127.0.0.1';
    }

    return ip;
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    const driverError = (error as { driverError?: { code?: string } })
      .driverError;
    const code = driverError?.code ?? (error as { code?: string }).code;

    return code === '23505';
  }
}
