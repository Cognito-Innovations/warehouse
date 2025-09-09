import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rack } from '../../racks/rack.entity';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity('rack_documents')
export class RackDocument extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rack_id: string;

  @ManyToOne(() => Rack)
  @JoinColumn({ name: 'rack_id' })
  rack: Rack;

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
