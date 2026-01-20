import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('ecommerce_user_delivery_selections')
export class EcommerceUserDeliverySelection extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @OneToOne(() => User, (user) => user.deliverySelection, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  delivery_platform: string;

  @Column('float')
  total_amount: number;

  @Column({ nullable: true })
  estimated_time: string;

  @Column({ nullable: true })
  description: string;
}
