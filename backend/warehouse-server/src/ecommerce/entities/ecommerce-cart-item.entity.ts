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

export interface ComputedCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: EcommerceProduct | null;
  unit_price: number;
  total_price: number;
  discount_amount: number;
  created_at: number;
  updated_at: number;
}

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

  @ManyToOne(() => EcommerceProduct, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: EcommerceProduct;

  @Column()
  quantity: number;
}
