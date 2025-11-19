import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Invoice } from './invoice.entity';

@Entity('invoice_charges')
export class InvoiceCharge extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.charges, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;
}