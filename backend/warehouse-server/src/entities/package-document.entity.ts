import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Package } from './package.entity';
import { User } from '../users/entity/user.entity';

@Entity('package_documents')
export class PackageDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne(() => Package, package_ => package_.documents)
  package: Package;

  @Column()
  document_name: string;

  @Column()
  original_filename: string;

  @Column()
  document_url: string;

  @Column()
  document_type: string;

  @Column({ type: 'bigint' })
  file_size: number;

  @Column()
  mime_type: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  is_required: boolean;

  @Column({ nullable: true })
  thumbnail_url: string;

  @Column({ nullable: true })
  file_hash: string;

  @Column()
  uploaded_by: string;

  @ManyToOne(() => User)
  uploader: User;

  @CreateDateColumn()
  uploaded_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
