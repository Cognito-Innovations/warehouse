import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ShipmentExport } from './shipment-export.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Shipment } from 'src/shipments/shipment.entity';

@Entity('shipment_export_boxes')
export class ShipmentExportBox extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShipmentExport, (shipmentExport) => shipmentExport.boxes, {
    onDelete: 'CASCADE',
  })
  shipmentExport: ShipmentExport;

  @OneToMany(() => Shipment, (shipment) => shipment.shipmentExportBox, {
    cascade: false,
  })
  shipments: Shipment[];

  @Column({ nullable: true })
  label: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  length_cm: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  breadth_cm: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  height_cm: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  volumetric_weight: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  mass_weight: number;
}
