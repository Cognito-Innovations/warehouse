import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../Countries/country.entity';

//TODO: Country should be a relation
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  suite_no: string;

  @Column({ nullable: true, default: 'admin' })
  identifier: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  phone_number_2: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ default: false })
  verified: boolean;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  is_logged_in: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ nullable: true })
  last_logout: Date;

  // @DeleteDateColumn() - Commented out because the database doesn't have this column
  // deleted_at: Date;
}
