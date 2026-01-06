import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shipment } from './shipment.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('shipment_pieces')
export class ShipmentPiece extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  piece_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  length: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  width: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  height: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  volumetric_weight: number;

  @ManyToOne(() => Shipment, (shipment) => shipment.pieces, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;
}
