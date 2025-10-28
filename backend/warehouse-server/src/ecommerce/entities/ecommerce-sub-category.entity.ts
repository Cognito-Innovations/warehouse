import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceCategory } from './ecommerce-category.entity';
import { EcommerceProduct } from './ecommerce-product.entity';

@Entity('ecommerce_sub_categories')
export class EcommerceSubCategory extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EcommerceCategory, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: EcommerceCategory;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_percentage: number;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => EcommerceProduct, (product) => product.sub_category)
  products: EcommerceProduct[];
}
