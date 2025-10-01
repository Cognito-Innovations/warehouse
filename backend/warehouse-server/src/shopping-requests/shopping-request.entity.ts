import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { TrackingRequest } from 'src/tracking-requests/tracking-request.entity';

export enum ShoppingRequestStatus {
  REQUESTED = 'REQUESTED',
  QUOTATION_READY = 'QUOTATION_READY',
  QUOTATION_CONFIRMED = 'QUOTATION_CONFIRMED',
  INVOICED = 'INVOICED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  ORDER_PLACED = 'ORDER_PLACED',
  REJECTED = 'REJECTED',
}

@Entity('shopping_requests')
export class ShoppingRequest extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CourierCompany, { eager: true, nullable: false })
  @JoinColumn({ name: 'courier_id' })
  courier: CourierCompany;

  @Column({ unique: true })
  request_code: string;

  @Column({ default: 0 })
  items_count: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: ShoppingRequestStatus,
    default: ShoppingRequestStatus.REQUESTED,
  })
  status: ShoppingRequestStatus;

  @OneToMany(
    () => TrackingRequest,
    (trackingRequest) => trackingRequest.feature_fid
  )
  tracking_requests: TrackingRequest[];
}
