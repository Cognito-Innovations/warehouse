import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DeliveryOptionCache } from './delivery-option-cache.entity';

@Entity('delivery_cache')
export class DeliveryCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column('bigint')
  expiry: number;

  @OneToMany(() => DeliveryOptionCache, (option) => option.deliveryCache, {
    cascade: true,
  })
  options: DeliveryOptionCache[];
}
