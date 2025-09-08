import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShipmentExport } from './shipment-export.entity';
import { User } from 'src/users/user.entity';
import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('shipment_export_boxes')
export class ShipmentExportBox extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ShipmentExport, shipmentExport => shipmentExport.boxes, { onDelete: 'CASCADE' })
  shipmentExport: ShipmentExport;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

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