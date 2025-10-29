import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ShoppingRequest } from 'src/shopping-requests/shopping-request.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Shipment } from 'src/shipments/shipment.entity';
import { InvoiceCharge } from './invoice-charge.entity';

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

@Entity('invoices')
export class Invoice extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  invoice_no: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gst: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @ManyToOne(() => ShoppingRequest, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopping_request_id' })
  shopping_request: ShoppingRequest;

  @OneToMany(() => ShoppingRequestProduct, (product) => product.invoice, {
    cascade: true,
  })
  products: ShoppingRequestProduct[];

  @ManyToOne(() => Shipment, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment?: Shipment;

  @OneToMany(() => InvoiceCharge, (charge) => charge.invoice, {
    eager: true,
    cascade: true,
  })
  charges?: InvoiceCharge[];
}
