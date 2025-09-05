import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';

@Entity('shipment_exports')
export class ShipmentExport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  export_code: string;

  @Column({ nullable: true })
  mawb: string;

  @Column({ default: 0 })
  boxes_count: number;

  @Column()
  created_by: string;

  @Column({ default: 'DRAFT' })
  status: string;

  @OneToMany(() => ShipmentExportBox, box => box.shipmentExport, { cascade: true })
  boxes: ShipmentExportBox[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}