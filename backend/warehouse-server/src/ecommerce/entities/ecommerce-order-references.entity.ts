import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceProduct } from './ecommerce-product.entity';
import { EcommercePayment } from './ecommerce-payments.entity';
import { EcommerceUserItem } from './ecommerce-user-items.entity';

@Entity('ecommerce_order_references')
export class EcommerceOrderReference extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payment_id: string;

  @ManyToOne(() => EcommercePayment, (payment) => payment.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: EcommercePayment;

  @Column()
  user_item_id: string;

  @ManyToOne(() => EcommerceUserItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_item_id' })
  user_item: EcommerceUserItem;

  @Column()
  product_id: string;

  @ManyToOne(() => EcommerceProduct, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: EcommerceProduct;
}
