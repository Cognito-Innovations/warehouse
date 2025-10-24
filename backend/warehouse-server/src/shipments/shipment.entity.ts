import { Country } from 'src/Countries/country.entity';
import { Package } from 'src/packages/entities';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { ShipmentExportBox } from 'src/shipment-export/shipment-export-box.entity';
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
  REJECTED = 'REJECTED',
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

  @ManyToOne(() => ShipmentExportBox, (box) => box.packages, {
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
}
