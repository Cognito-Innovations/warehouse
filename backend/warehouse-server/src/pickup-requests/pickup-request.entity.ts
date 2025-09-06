import { Country } from 'src/countries/entity/country.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('pickup_requests')
export class PickupRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  est_weight: string;

  @Column()
  pkg_details: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
