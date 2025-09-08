import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Country } from 'src/Countries/country.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('shopping_requests')
export class ShoppingRequest extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  // @ManyToOne(() => Country, { eager: true, nullable: false })
  // @JoinColumn({ name: 'country_id' })
  // country: Country;

  @Column({ type: 'text', nullable: true })
  country: string;

  @Column({ unique: true })
  request_code: string;

  @Column({ default: 0 })
  items: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'REQUESTED' })
  status: string;

  @Column({ type: 'json', nullable: true })
  payment_slips: string[];
}