import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity({ name: 'client_identifiers' })
@Unique(['ip_address'])
export class ClientIdentifier extends BaseTimestampEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, unique: true })
  ip_address: string;
}
