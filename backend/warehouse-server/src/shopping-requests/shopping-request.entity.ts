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

  //TODO: Remove nullable
  @Column({ nullable: true })
  user_id: string;

  //TODO: add unique and remove nullable
  @Column({ nullable: true })
  request_code: string;

  //TODO: Remove nullable
  @Column({ nullable: true })
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
