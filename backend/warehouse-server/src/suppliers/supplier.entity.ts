import { Country } from 'src/Countries/country.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Country, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ unique: true })
  supplier_name: string;

  @Column({ nullable: true })
  contact_number: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'bigint' })
  created_at: number;

  @BeforeInsert()
  setCreatedAt() {
    const now = Math.floor(Date.now() / 1000); // epoch seconds
    this.created_at = now;
  }
}
