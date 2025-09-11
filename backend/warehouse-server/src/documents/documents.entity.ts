import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { User } from 'src/users/user.entity';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';

@Entity('documents')
export class Document extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'uploaded_by' })
  uploaded_by: User;

  @Column({
    type: 'enum',
    enum: FeatureType,
  })
  feature_type: FeatureType;

  @Column()
  feature_fid: string;

  @Column()
  document_name: string;

  @Column()
  original_filename: string;

  @Column()
  document_url: string;

  @Column()
  document_type: string;

  @Column({ type: 'int', nullable: true })
  file_size: number;

  @Column({ nullable: true })
  mime_type: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  is_required: boolean;

  @Column({ nullable: true })
  deleted_at: number;
}
