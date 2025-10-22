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

@Entity('ecommerce_sub_categories')
export class EcommerceSubCategory extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EcommerceCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: EcommerceCategory;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_percentage: number;

  @ManyToOne(() => Country, { eager: true, nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country | null;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;
}
