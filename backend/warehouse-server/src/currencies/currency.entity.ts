import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Country } from 'src/Countries/country.entity';

@Entity('currencies')
export class Currency extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column()
  currency_symbol: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate: number;
}
