import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeliveryCache } from './delivery-cache.entity';

@Entity('delivery_option_cache')
export class DeliveryOptionCache {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DeliveryCache, (cache) => cache.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'delivery_cache_id' })
  deliveryCache: DeliveryCache;

  @Column()
  delivery_platform: string;

  @Column('double precision')
  total_amount: number;

  @Column({ nullable: true })
  estimated_time: string;

  @Column({ nullable: true })
  description: string;
}
