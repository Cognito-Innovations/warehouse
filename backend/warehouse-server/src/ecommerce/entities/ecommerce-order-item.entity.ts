import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceOrder } from './ecommerce-order.entity';
import { EcommerceProduct } from './ecommerce-product.entity';

@Entity('ecommerce_order_items')
export class EcommerceOrderItem extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => EcommerceOrder, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: EcommerceOrder;

  @Column()
  product_id: string;

  @ManyToOne(() => EcommerceProduct, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: EcommerceProduct;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_percentage: number;
}
