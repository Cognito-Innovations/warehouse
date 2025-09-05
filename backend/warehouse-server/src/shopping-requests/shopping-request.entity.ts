import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shopping_requests')
export class ShoppingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ unique: true })
  request_code: string;

  @Column()
  country: string;

  @Column({ default: 0 })
  items: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ default: 'REQUESTED' })
  status: string;

  @Column({ type: 'json', nullable: true })
  payment_slips: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
