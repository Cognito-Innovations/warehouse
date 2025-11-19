import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceCart } from './ecommerce-cart.entity';
import { EcommerceProduct } from './ecommerce-product.entity';

//TODO: Generated temprorarily need to look requirment and change
@Entity('ecommerce_cart_items')
export class EcommerceCartItem extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cart_id: string;

  @ManyToOne(() => EcommerceCart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: EcommerceCart;

  @Column()
  product_id: string;

  @ManyToOne(() => EcommerceProduct, { eager: true })
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
