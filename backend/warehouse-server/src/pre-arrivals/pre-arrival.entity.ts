import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pre_arrival')
export class PreArrival extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer: string;

  @Column()
  suite: string;

  @Column()
  otp: number;

  @Column()
  tracking_no: string;

  @Column()
  estimate_arrival_time: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'received';
}