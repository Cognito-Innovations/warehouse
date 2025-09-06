import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Country } from '../../countries/entity/country.entity';
import { Rack } from '../../racks/rack.entity';
import { Supplier } from '../../suppliers/supplier.entity';
import { PackageItem } from './package-item.entity';
import { PackageCharge } from './package-charge.entity';
import { PackageDocument } from './package-document.entity';
import { PackageActionLog } from './package-action-log.entity';
import { PackageMeasurement } from './package-measurement.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tracking_no: string;

  @Column({ default: 'Action Required' })
  status: string;

  @Column()
  customer_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Supplier;

  @Column()
  rack_slot_id: string;

  @ManyToOne(() => Rack, { eager: true })
  @JoinColumn({ name: 'rack_slot_id' })
  rack_slot: Rack;

  @Column({ nullable: true })
  slot_info: string;

  @Column({ nullable: true })
  warehouse_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  total_weight: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  total_volumetric_weight: number | null;

  @Column()
  country: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country' })
  country_relation: Country;

  @Column({ default: false })
  allow_customer_items: boolean;

  @Column({ default: false })
  shop_invoice_received: boolean;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @Column({ default: false })
  dangerous_good: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ nullable: true })
  updated_by: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'updated_by' })
  updater: User;

  @Column({ nullable: true })
  package_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => PackageItem, (item) => item.package)
  items: PackageItem[];

  @OneToMany(() => PackageMeasurement, (measurement) => measurement.package)
  measurements: PackageMeasurement[];

  @OneToMany(() => PackageCharge, (charge) => charge.package_id)
  charges: PackageCharge[];

  @OneToMany(() => PackageDocument, (document) => document.package)
  documents: PackageDocument[];

  @OneToMany(() => PackageActionLog, (actionLog) => actionLog.package_id)
  action_logs: PackageActionLog[];
}
