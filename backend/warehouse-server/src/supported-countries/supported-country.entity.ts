import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('supported-country')
export class SupportedCountry extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ default: true })
  is_active: boolean;
}
