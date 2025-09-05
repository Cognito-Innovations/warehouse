import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tracking_no: string;

  @Column({ nullable: true })
  reference_no: string;

  @Column({ default: 'Action Required' })
  status: string;

  @Column()
  customer_id: string;

  @ManyToOne(() => User, { eager: true })
  customer: User;

  @Column()
  vendor_id: string;

  @Column()
  rack_slot_id: string;

  @Column({ nullable: true })
  slot_info: string;

  @Column({ nullable: true })
  warehouse_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  total_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  total_volumetric_weight: number;

  @Column({ default: false })
  dangerous_good: boolean;

  @Column({ default: false })
  allow_customer_items: boolean;

  @Column({ default: false })
  shop_invoice_received: boolean;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column()
  created_by: string;

  @ManyToOne(() => User, { eager: true })
  creator: User;

  @Column({ nullable: true })
  updated_by: string;

  @ManyToOne(() => User, { eager: true })
  updater: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany('PackageItem', (item) => item.package)
  items: any[];

  @OneToMany('PackageMeasurement', (measurement) => measurement.package)
  measurements: any[];

  @OneToMany('PackageCharge', (charge) => charge.package)
  charges: any[];

  @OneToMany('PackageDocument', (document) => document.package)
  documents: any[];

  @OneToMany('PackageActionLog', (actionLog) => actionLog.package)
  action_logs: any[];
}
