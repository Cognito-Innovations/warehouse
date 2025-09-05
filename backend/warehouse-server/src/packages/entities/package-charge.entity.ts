import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { User } from './user.entity';

@Entity('package_charges')
export class PackageCharge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne(() => Package, (package_) => package_.charges)
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
