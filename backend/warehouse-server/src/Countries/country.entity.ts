import { IsEnum } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CountryCode {
  USA = 'USA',
  CANADA = 'CANADA',
  UK = 'UK',
  AUSTRALIA = 'AUSTRALIA',
  NEW_ZEALAND = 'NEW_ZEALAND',
}

export enum CountryPhoneCode {
  USA = '+1',
  UK = '+44',
  AUSTRALIA = '+61',
  NEW_ZEALAND = '+64',
}

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEnum(CountryCode)
  @Column({ unique: true })
  code: CountryCode;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @IsEnum(CountryPhoneCode)
  @Column()
  phone_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
