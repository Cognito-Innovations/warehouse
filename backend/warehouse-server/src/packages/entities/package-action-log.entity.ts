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

@Entity('package_action_logs')
export class PackageActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne('Package', (packageEntity) => packageEntity.action_logs)
  @JoinColumn({ name: 'package_id' })
  package: any;

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

  @Column({ nullable: true })
  uploaded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
