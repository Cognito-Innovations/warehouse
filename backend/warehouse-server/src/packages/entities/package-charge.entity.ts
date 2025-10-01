import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Package } from './package.entity';

@Entity('package_charges')
export class PackageCharge extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Package, (pkg) => pkg.charges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  amount: number;
}
