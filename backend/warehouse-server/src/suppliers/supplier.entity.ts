import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  country: string;

  @Column()
  supplier_name: string;

  @Column({ nullable: true })
  contact_number: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  created_at: Date;
}
