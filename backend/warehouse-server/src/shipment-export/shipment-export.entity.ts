import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('shipment_exports')
export class ShipmentExport extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  export_code: string;

  @Column({ nullable: true })
  mawb: string;

  boxes_count: number;

  @Column()
  created_by: string;

  @Column({ default: 'DRAFT' })
  status: string;

  @OneToMany(() => ShipmentExportBox, (box) => box.shipmentExport, {
    cascade: true,
  })
  boxes: ShipmentExportBox[];

  @AfterLoad()
  updateBoxesCount() {
    this.boxes_count = this.boxes ? this.boxes.length : 0;
  }
}
