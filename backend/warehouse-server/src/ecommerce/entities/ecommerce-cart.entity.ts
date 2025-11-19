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
import { EcommerceCartItem } from './ecommerce-cart-item.entity';

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  CHECKED_OUT = 'CHECKED_OUT',
}

@Entity('ecommerce_carts')
export class EcommerceCart extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  final_amount: number;

  @OneToMany(() => EcommerceCartItem, (item: EcommerceCartItem) => item.cart, {
    cascade: true,
  })
  items: EcommerceCartItem[];
}
