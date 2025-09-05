import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer: string;

  @Column()
  rack_slot: string;

  @Column()
  vendor: string;

  @Column({ default: 'Action Required' })
  status: string;

  @Column({ default: false })
  dangerous_good: boolean;

  @Column()
  created_by: string;

  @Column({ unique: true })
  custom_package_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
