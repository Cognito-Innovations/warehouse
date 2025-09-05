import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne
} from 'typeorm';
import { ShipmentExport } from './shipment-export.entity';

@Entity('shipment_export_boxes')
export class ShipmentExportBox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShipmentExport, shipmentExport => shipmentExport.boxes, { onDelete: 'CASCADE' })
  shipmentExport: ShipmentExport;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}