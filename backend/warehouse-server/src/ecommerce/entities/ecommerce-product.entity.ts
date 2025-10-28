import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceCategory } from './ecommerce-category.entity';
import { EcommerceSubCategory } from './ecommerce-sub-category.entity';
import { EcommerceMeasurement } from './measurement.entity';

@Entity('ecommerce_products')
export class EcommerceProduct extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  slug: string;

  @ManyToOne(() => EcommerceCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: EcommerceCategory;

  @ManyToOne(() => EcommerceSubCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_category_id' })
  sub_category: EcommerceSubCategory;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column()
  image_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unit_value: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => EcommerceMeasurement, { eager: true, nullable: true })
  @JoinColumn({ name: 'measurement_id' })
  measurement: EcommerceMeasurement;
}
