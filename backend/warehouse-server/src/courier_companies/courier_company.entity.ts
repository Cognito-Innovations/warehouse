import { Country } from 'src/Countries/country.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courier_companies')
export class CourierCompany {
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

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
