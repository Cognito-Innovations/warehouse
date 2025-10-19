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

  //TODO: Need to add discount percentage here because there might be chance entire sub category is on discount.

  @Column()
  image_url: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;
}
