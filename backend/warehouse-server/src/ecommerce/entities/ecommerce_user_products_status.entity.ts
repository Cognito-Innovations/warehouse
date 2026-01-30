import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EcommerceProduct } from './ecommerce-product.entity';
import { User } from 'src/users/user.entity';

export enum UserProductStatus {
  CART = 'CART',
  ORDERED = 'ORDERED',
}

@Entity('ecommerce_user_products_status')
export class EcommerceUserProductStatus extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  product_id: string;

  @ManyToOne(() => EcommerceProduct, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: EcommerceProduct;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: UserProductStatus,
    default: UserProductStatus.CART,
  })
  status: UserProductStatus;
}
