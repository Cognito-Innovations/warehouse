import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
