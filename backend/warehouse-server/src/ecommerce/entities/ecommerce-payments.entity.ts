import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EcommerceOrderReference } from './ecommerce-order-references.entity';

export enum Status {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('ecommerce_payments')
export class EcommercePayment extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_number: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ type: 'varchar', default: 'paypal' })
  payment_gateway: string;

  @Column({ type: 'varchar', default: 'UNKNOWN' })
  payment_mode: string;

  @Column({ type: 'text', nullable: true })
  gateway_order_id: string;

  @Column({ type: 'text', nullable: true })
  gateway_transaction_id: string;

  @OneToMany(
    () => EcommerceOrderReference,
    (item: EcommerceOrderReference) => item.payment,
    {
      cascade: true,
    },
  )
  items: EcommerceOrderReference[];
}
