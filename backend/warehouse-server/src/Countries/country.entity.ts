import { IsEnum } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

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

@Entity('countries')
export class Country extends BaseTimestampEntity {
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
}
