import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pickup_requests')
export class PickupRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  pickup_address: string;

  @Column()
  supplier_name: string;

  @Column()
  supplier_phone: string;

  @Column({ nullable: true })
  alt_phone: string;

  @Column()
  pcs_box: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  est_weight: number;

  @Column()
  pkg_details: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'REQUESTED' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ nullable: true })
  quoted_at: Date;

  @Column({ nullable: true })
  confirmed_at: Date;

  @Column({ nullable: true })
  picked_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
