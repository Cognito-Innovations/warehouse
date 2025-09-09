import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
export class User extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'user' })
  role: Role;

  @Column({ nullable: true })
  image: string;

  //TODO: Remove nullable
  @Column({ nullable: true })
  suite_no: string;

  @Column({ nullable: true, default: 'google' })
  identifier: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  phone_number_2: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  verified: boolean;

  @ManyToOne(() => Country, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ default: false })
  is_logged_in: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ nullable: true })
  last_logout: Date;
}
