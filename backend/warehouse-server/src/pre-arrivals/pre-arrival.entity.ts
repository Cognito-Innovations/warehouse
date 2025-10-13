import { Length } from 'class-validator';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

//TODO P0: Add validations for all the fields in the entity and the dto. please test it, due to timeconstraints didn't tested.
@Entity('pre_arrival')
export class PreArrival extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(1, 36, { message: 'User name must be between 1 and 36 characters' })
  user: string;

  @Column()
  @Length(6, 6, { message: 'Suite must be exactly 6 characters' })
  suite: string;

  @Column()
  @Length(4, 4, { message: 'OTP must be exactly 4 characters' })
  otp: number;

  @Column()
  @Length(10, 14, {
    message: 'Tracking number must be between 10 and 14 characters',
  })
  tracking_no: string;

  @Column()
  estimate_arrival_time: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'received';
}
