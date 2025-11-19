import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity('racks')
export class Rack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  label: string;

  @Column()
  color: string;

  @Column({ nullable: true, default: 0 })
  count: number;

  @Column({ type: 'bigint' })
  created_at: number;

  @BeforeInsert()
  setCreatedAt() {
    const now = Math.floor(Date.now() / 1000); // epoch seconds
    this.created_at = now;
  }
}
