import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shopping_request_products')
export class Product extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopping_request_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'boolean', nullable: true })
  available: boolean;
}