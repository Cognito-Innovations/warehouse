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

@Entity('package_documents')
export class PackageDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne('Package', (packageEntity: any) => packageEntity.documents)
  @JoinColumn({ name: 'package_id' })
  package: any;

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
