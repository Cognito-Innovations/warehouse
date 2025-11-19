import { Invoice } from 'src/invoice/entities/invoice.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('shopping_request_products')
export class ShoppingRequestProduct extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.products, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column()
  shopping_request_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column({ type: 'varchar', length: 10, default: 'US' })
  currency: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'text', nullable: true })
  size: string;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'text', nullable: true })
  variants: string;

  @Column({ type: 'text', nullable: true })
  if_not_available_quantity: string;

  @Column({ type: 'text', nullable: true })
  if_not_available_color: string;

  @Column({ type: 'boolean', nullable: true })
  available: boolean;
}
