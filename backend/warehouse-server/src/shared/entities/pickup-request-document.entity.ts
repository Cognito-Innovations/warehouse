import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PickupRequest } from '../../pickup-requests/pickup-request.entity';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity('pickup_request_documents')
export class PickupRequestDocument extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pickup_request_id: string;

  @ManyToOne(() => PickupRequest)
  @JoinColumn({ name: 'pickup_request_id' })
  pickup_request: PickupRequest;

  @Column()
  document_name: string;

  @Column()
  original_filename: string;

  @Column()
  document_url: string;

  @Column()
  document_type: string;

  @Column()
  file_size: number;

  @Column()
  mime_type: string;

  @Column()
  category: string;

  @Column()
  is_required: boolean;

  @Column()
  uploaded_by: string;

  @DeleteDateColumn({ type: 'bigint', nullable: true })
  deleted_at: number | null;
}
