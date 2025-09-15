import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Package } from './package.entity';

@Entity('package_action_logs')
export class PackageActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne(() => Package, (pkg) => pkg.action_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  file_name: string;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @Column()
  file_size: number;

  @Column()
  mime_type: string;

  @Column()
  uploaded_by: string;

  @Column({ default: false })
  is_completed: boolean;

  @Column({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  completed_by: string;

  @Column({ type: 'bigint', nullable: true })
  uploaded_at: number;

  @BeforeInsert()
  setUploadedAt() {
    this.uploaded_at = Math.floor(Date.now() / 1000); // epoch seconds
  }

  // Timestamp columns removed as they don't exist in the database
  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;

  // @DeleteDateColumn()
  // deleted_at: Date;
}
