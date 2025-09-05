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
import { PreArrival } from '../../pre-arrivals/pre-arrival.entity';

@Entity('pre_arrival_documents')
export class PreArrivalDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pre_arrival_id: string;

  @ManyToOne(() => PreArrival)
  @JoinColumn({ name: 'pre_arrival_id' })
  pre_arrival: PreArrival;

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
