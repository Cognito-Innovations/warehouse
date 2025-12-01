import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EcommerceSubCategory } from './ecommerce-sub-category.entity';
import { EcommerceProduct } from './ecommerce-product.entity';

@Entity('ecommerce_categories')
export class EcommerceCategory extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_percentage: number;

  @ManyToMany(() => Country, { eager: true })
  @JoinTable({
    name: 'ecommerce_category_countries',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'country_id',
      referencedColumnName: 'id',
    },
  })
  countries: Country[]

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => EcommerceSubCategory, (subCategory) => subCategory.category)
  sub_categories: EcommerceSubCategory[];

  @OneToMany(() => EcommerceProduct, (product) => product.category)
  products: EcommerceProduct[];
}
