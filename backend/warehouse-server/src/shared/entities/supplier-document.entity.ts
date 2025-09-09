import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from '../../suppliers/supplier.entity';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity('supplier_documents')
export class SupplierDocument extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  supplier_id: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

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
