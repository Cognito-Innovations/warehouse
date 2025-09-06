import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  image: string;

  //TODO: Remove nullable
  @Column({ nullable: true })
  suite_no: string;

  @Column({ nullable: true, default: 'google' })
  identifier: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  phone_number_2: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  verified: boolean;

  //TODO: Uncomment and remove nullable
  // @ManyToOne(() => Country, { eager: true })
  // @JoinColumn({ name: 'id' })
  @Column({ nullable: true })
  country: string;

  @Column({ default: false })
  is_logged_in: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @Column({ nullable: true })
  last_logout: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
