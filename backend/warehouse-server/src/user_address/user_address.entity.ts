import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('user_addresses')
export class UserAddress extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  country: string;

  @Column()
  zip_code: string;

  @Column()
  state: string;

  @Column()
  city: string;
}
