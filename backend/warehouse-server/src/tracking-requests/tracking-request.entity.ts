import { Role, User } from 'src/users/user.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';

export enum FeatureType {
  ShoppingRequest = 'shopping-request',
  Package = 'package',
  PickupRequest = 'pickup-request',
  PreArrival = 'pre-arrival',
  Rack = 'rack',
  Supplier = 'supplier',
  User = 'user',
}

export enum TrackingStatus {
  Accepted = 'accepted',
  ActionRequired = 'action_required',
  Cancelled = 'cancelled',
  Discarded = 'discarded',
  InReview = 'in_review',
  Invoiced = 'invoiced',
  PaymentPending = 'payment_pending',
  PaymentApproved = 'payment_approved',
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
export class TrackingRequest extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CourierCompany, { eager: true })
  @JoinColumn({ name: 'courier_id' })
  courier: CourierCompany;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin?: User;

  @Column({
    type: 'enum',
    enum: FeatureType,
  })
  feature_type: FeatureType;

  @Column({
    type: 'enum',
    enum: TrackingStatus,
  })
  status: TrackingStatus;

  @Column({ default: Role.User })
  role: Role;

  @Column()
  feature_fid: string;
}
