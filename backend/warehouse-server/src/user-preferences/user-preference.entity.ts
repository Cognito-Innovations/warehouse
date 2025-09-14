import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { Currency } from 'src/currencies/currency.entity';
import { User } from 'src/users/user.entity';

@Entity('user_preferences')
export class UserPreference extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CourierCompany, { eager: true })
  @JoinColumn({ name: 'courier_id' })
  courier: CourierCompany;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;
}
