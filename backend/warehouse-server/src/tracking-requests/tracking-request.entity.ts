import { User } from 'src/users/user.entity';
import { Country } from 'src/countries/entity/country.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

export enum FeatureType {
  ShoppingRequest = 'shopping-request',
  Package = 'package',
  PickupRequest = 'pickup-request',
  PreArrival = 'pre-arrival',
  Rack = 'rack',
  Supplier = 'supplier',
  User = 'user',
}

export enum Status {
  Accepted = 'accepted',
  ActionRequired = 'action_required',
  Cancelled = 'cancelled',
  Discarded = 'discarded',
  InReview = 'in_review',
  Invoiced = 'invoiced',
  OrderPlaced = 'order_placed',
  Paid = 'paid',
  QuotationConfirmed = 'quotation_confirmed',
  Quoted = 'quoted',
  ReadyToShip = 'ready_to_ship',
  RequestShip = 'request_ship',
  Requested = 'requested',
  Shipped = 'shipped',
}

@Entity('tracking_request')
export class TrackingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: FeatureType,
  })
  feature_type: FeatureType;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @Column()
  feature_fid: string;

  @Column({ nullable: true, default: 0 })
  count: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
