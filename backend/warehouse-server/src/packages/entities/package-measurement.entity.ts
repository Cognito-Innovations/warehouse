import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('package_measurements')
export class PackageMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne('Package', (package_) => package_.measurements)
  @JoinColumn({ name: 'package_id' })
  package: any;

  @Column()
  piece_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  volumetric_weight: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  height: number;

  @Column({ default: false })
  has_measurements: boolean;

  @Column({ default: false })
  measurement_verified: boolean;

  @Column({ nullable: true })
  verified_by: string;

  @ManyToOne(() => User)
  verifier: User;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
