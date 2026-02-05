import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { IsEmail, MinLength } from 'class-validator';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { PreArrival } from 'src/pre-arrivals/pre-arrival.entity';
import { UserAddress } from 'src/user_address/user_address.entity';
import { EcommerceUserDeliverySelection } from 'src/ecommerce/entities/ecommerce_user_delivery_selections.entity';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum Role {
  Admin = 'admin',
  User = 'user',
  SuperAdmin = 'super_admin',
}

export enum Identifier {
  Google = 'google',
  Email = 'email',
}

@Entity('users')
export class User extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  id_card_passport_no: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  @MinLength(6)
  suite_no: string;

  @Column({ default: Identifier.Email })
  identifier: Identifier;

  @Column({ nullable: true })
  phone_code: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  alternate_phone_number: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  dob: Date;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  otp_expires_at: Date | null;

  @Column({ nullable: true, select: false })
  last_logout: number;

  @OneToOne(() => UserPreference, (preference) => preference.user)
  preference: UserPreference;

  @OneToMany(() => PreArrival, (preArrival) => preArrival.user)
  preArrivals: PreArrival[];

  @OneToMany(() => UserAddress, (address) => address.user)
  address: UserAddress[];

  @OneToOne(() => EcommerceUserDeliverySelection, (selection) => selection.user)
  deliverySelection: EcommerceUserDeliverySelection;
}
