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
import { Shipment } from 'src/shipments/shipment.entity';

@Entity('packages')
export class Package extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  tracking_no: string;

  @Column({ default: 'Action Required' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  shipment_id: string | null;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  vendor_id: string;

  @ManyToOne(() => Supplier, { eager: true })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Supplier;

  @Column({ nullable: true })
  rack_slot_id: string | null;

  @ManyToOne(() => Rack, { eager: true, nullable: true })
  @JoinColumn({ name: 'rack_slot_id' })
  rack_slot: Rack | null;

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

  @OneToMany(() => PackageItem, (item: PackageItem) => item.package, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  items: PackageItem[];

  @OneToMany(
    () => PackageMeasurement,
    (measurement: PackageMeasurement) => measurement.package,
    { cascade: true, onDelete: 'CASCADE' },
  )
  measurements: PackageMeasurement[];

  @OneToMany(() => PackageCharge, (charge: PackageCharge) => charge.package, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  charges: PackageCharge[];

  @OneToMany(() => PackageDocument, (document) => document.package, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  documents: PackageDocument[];

  @OneToMany(() => PackageActionLog, (actionLog) => actionLog.package, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  action_logs: PackageActionLog[];

  @ManyToOne(() => Shipment, (shipment) => shipment.packages,{
    onDelete: 'SET NULL',
    nullable: true 
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;
}
