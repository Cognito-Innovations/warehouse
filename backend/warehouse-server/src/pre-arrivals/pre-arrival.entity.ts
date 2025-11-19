import { Length, Max, Min } from 'class-validator';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('pre_arrival')
export class PreArrival extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.preArrivals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Min(1000, { message: 'OTP must be exactly 4 digits' })
  @Max(9999, { message: 'OTP must be exactly 4 digits' })
  otp: number;

  @Column()
  @Length(7, 14, {
    message: 'Tracking number must be between 7 and 14 characters',
  })
  tracking_no: string;

  @Column()
  estimate_arrival_time: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'received';
}
