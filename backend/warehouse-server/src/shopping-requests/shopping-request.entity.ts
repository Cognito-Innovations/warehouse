import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Country } from 'src/Countries/country.entity';

export enum ShoppingRequestStatus {
  REQUESTED = 'REQUESTED',
  QUOTATION_READY = 'QUOTATION_READY',
  QUOTATION_CONFIRMED = 'QUOTATION_CONFIRMED',
  INVOICED = 'INVOICED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  ORDER_PLACED = 'ORDER_PLACED',
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

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ unique: true })
  request_code: string;

  @Column({ default: 0 })
  items: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: ShoppingRequestStatus,
    default: ShoppingRequestStatus.REQUESTED,
  })
  status: ShoppingRequestStatus;
}
