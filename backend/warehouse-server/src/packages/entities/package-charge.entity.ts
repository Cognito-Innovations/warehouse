import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Package } from './package.entity';

@Entity('package_charges')
export class PackageCharge extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne(() => Package, (pkg) => pkg.charges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  summary: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  charge_type: string;

  @Column({ default: true })
  is_taxable: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0 })
  tax_rate: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ nullable: true })
  paid_by: string;

  @ManyToOne(() => User)
  payer: User;

  @DeleteDateColumn({ type: 'bigint', nullable: true })
  deleted_at: number | null;
}
