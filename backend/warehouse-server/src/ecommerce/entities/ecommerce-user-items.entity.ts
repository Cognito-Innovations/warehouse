import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserItemStatus {
  CART = 'CART',
  ORDERED = 'ORDERED',
}

@Entity('ecommerce_user_items')
export class EcommerceUserItem extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  product_id: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: UserItemStatus,
    default: UserItemStatus.CART,
  })
  status: UserItemStatus;
}
