import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('racks')
export class Rack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column()
  color: string;

  @Column({ nullable: true, default: 0 })
  count: number;

  @CreateDateColumn()
  created_at: Date;
}
