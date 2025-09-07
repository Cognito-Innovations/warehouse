import { Country } from 'src/Countries/country.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('supported-country')
export class SupportedCountry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
