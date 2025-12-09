import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import {
  ComputedCartItem,
  EcommerceCartItem,
} from './ecommerce-cart-item.entity';

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  CHECKED_OUT = 'CHECKED_OUT',
}

export interface ComputedCart {
  items: ComputedCartItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
}

@Entity('ecommerce_carts')
export class EcommerceCart extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @OneToMany(() => EcommerceCartItem, (item: EcommerceCartItem) => item.cart, {
    cascade: true,
  })
  items: EcommerceCartItem[];
}
