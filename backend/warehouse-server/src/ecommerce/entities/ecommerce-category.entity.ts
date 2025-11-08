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
import { EcommerceSubCategory } from './ecommerce-sub-category.entity';
import { EcommerceProduct } from './ecommerce-product.entity';

export enum CargoType {
  PERISHABLE_GOODS = 'Perishable goods',
  ANIMAL_CARGO = 'Animal cargo',
  GENERAL_COURIER = 'General courier',
  GENERAL_CARGO = 'General cargo',
}

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

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'enum', enum: CargoType })
  cargo_type: CargoType;

  @OneToMany(() => EcommerceSubCategory, (subCategory) => subCategory.category)
  sub_categories: EcommerceSubCategory[];

  @OneToMany(() => EcommerceProduct, (product) => product.category)
  products: EcommerceProduct[];
}
