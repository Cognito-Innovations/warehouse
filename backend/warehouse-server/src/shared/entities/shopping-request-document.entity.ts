import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingRequest } from '../../shopping-requests/shopping-request.entity';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity('shopping_request_documents')
export class ShoppingRequestDocument extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopping_request_id: string;

  @ManyToOne(() => ShoppingRequest)
  @JoinColumn({ name: 'shopping_request_id' })
  shopping_request: ShoppingRequest;

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
