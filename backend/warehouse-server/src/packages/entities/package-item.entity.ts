import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('package_items')
export class PackageItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  package_id: string;

  @ManyToOne('Package', (packageEntity: any) => packageEntity.items)
  @JoinColumn({ name: 'package_id' })
  package: any;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
