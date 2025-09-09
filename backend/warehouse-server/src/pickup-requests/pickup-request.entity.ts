import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

export enum PickupRequestStatus {
  Requested = 'requested',
  Quoted = 'quoted',
  Confirmed = 'confirmed',
  Picked = 'picked',
}

@Entity('pickup_requests')
export class PickupRequest extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column()
  pickup_address: string;

  @Column()
  supplier_name: string;

  @Column()
  supplier_phone_number: string;

  @Column({ nullable: true })
  alt_supplier_phone_number: string;

  @Column()
  pcs_box: string;

  @Column({ type: 'text', nullable: true })
  est_weight: string;

  @Column()
  pkg_details: string;

  @Column({
    type: 'enum',
    enum: PickupRequestStatus,
    default: PickupRequestStatus.Requested,
  })
  status: PickupRequestStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;
}
