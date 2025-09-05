import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { Package } from './package.entity';
import { User } from '../users/entity/user.entity';

@Entity('package_action_logs')
export class PackageActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne(() => Package, package_ => package_.action_logs)
  package: Package;

  @Column()
  file_name: string;

  @Column()
  file_url: string;

  @Column()
  file_type: string;

  @Column({ type: 'bigint' })
  file_size: number;

  @Column()
  mime_type: string;

  @Column({ default: false })
  is_completed: boolean;

  @Column()
  uploaded_by: string;

  @ManyToOne(() => User)
  uploader: User;

  @CreateDateColumn()
  uploaded_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  completed_by: string;

  @ManyToOne(() => User)
  completer: User;

  @DeleteDateColumn()
  deleted_at: Date;
}
