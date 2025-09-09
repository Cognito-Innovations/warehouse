import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('package_items')
export class PackageItem extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  package_id: string;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;
}
