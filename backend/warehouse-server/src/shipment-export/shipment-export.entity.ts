import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { User } from 'src/users/user.entity';
import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('shipment_exports')
export class ShipmentExport extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

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
}