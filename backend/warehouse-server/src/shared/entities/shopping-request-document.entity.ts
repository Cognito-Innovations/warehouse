import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingRequest } from '../../shopping-requests/shopping-request.entity';

@Entity('shopping_request_documents')
export class ShoppingRequestDocument {
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
