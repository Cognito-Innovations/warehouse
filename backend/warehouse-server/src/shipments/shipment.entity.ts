import { Country } from 'src/Countries/country.entity';
import { Package } from 'src/packages/entities';
import { Rack } from 'src/racks/rack.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { ShipmentExportBox } from 'src/shipment-export/shipment-export-box.entity';
import { TrackingRequest } from 'src/tracking-requests/tracking-request.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum ShipmentStatus {
  SHIP_REQUEST = 'SHIP_REQUEST',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  DEPARTED = 'DEPARTED',
  DISCARDED = 'DISCARDED',
}

@Entity('shipments')
export class Shipment extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shipment_no: string;

  @Column()
  tracking_no: string;

  @Column({
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.SHIP_REQUEST,
  })
  status: ShipmentStatus;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ShipmentExportBox, (box) => box.shipments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'shipment_export_box_id' })
  shipmentExportBox: ShipmentExportBox | null;

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Package, (pkg) => pkg.shipment)
  packages: Package[];

  @ManyToOne(() => Rack, { eager: true, nullable: true })
  @JoinColumn({ name: 'rack_slot_id' })
  rack_slot: Rack | null;

  @OneToMany(
    () => TrackingRequest,
    (trackingRequest) => trackingRequest.feature_fid
  )
  tracking_requests: TrackingRequest[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  customs_value: number;

  @Column({ type: 'boolean', default: false })
  dangerous_good: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_volumetric_weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  height: number;
}
