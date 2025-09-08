import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Country } from '../../Countries/country.entity';
import { Rack } from '../../racks/rack.entity';
import { Supplier } from '../../suppliers/supplier.entity';
import { PackageItem } from './package-item.entity';
import { PackageCharge } from './package-charge.entity';
import { PackageDocument } from './package-document.entity';
import { PackageActionLog } from './package-action-log.entity';
import { PackageMeasurement } from './package-measurement.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('packages')
export class Package extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tracking_no: string;

  @Column({ default: 'Action Required' })
  status: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ default: false })
  allow_user_items: boolean;

  @Column({ default: false })
  shop_invoice_received: boolean;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @Column({ default: false })
  dangerous_good: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column({ nullable: true })
  package_id: string;

  @DeleteDateColumn({ type: 'bigint', nullable: true })
  deleted_at: number | null;

  @OneToMany(() => PackageItem, (item: PackageItem) => item.package)
  items: PackageItem[];

  @OneToMany(
    () => PackageMeasurement,
    (measurement: PackageMeasurement) => measurement.package,
  )
  measurements: PackageMeasurement[];

  @OneToMany(() => PackageCharge, (charge: PackageCharge) => charge.package_id)
  charges: PackageCharge[];

  @OneToMany(() => PackageDocument, (document) => document.package)
  documents: PackageDocument[];

  @OneToMany(() => PackageActionLog, (actionLog) => actionLog.package_id)
  action_logs: PackageActionLog[];
}
