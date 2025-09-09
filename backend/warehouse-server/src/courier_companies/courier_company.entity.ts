import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('courier_companies')
export class CourierCompany extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  address: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ default: true })
  is_active: boolean;
}
