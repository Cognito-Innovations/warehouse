import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { User } from 'src/users/entity/user.entity';


@Entity('package_measurements')
export class PackageMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'package_id' })
  packageId: string;

  @ManyToOne(() => Package, (package_) => package_.measurements)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({nullable: true})
  piece_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  volumetric_weight: number | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  length: number | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  width: number | null;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  height: number | null;

  @Column({ default: false })
  has_measurements: boolean;

  @Column({ default: false })
  measurement_verified: boolean;

  // @Column({ nullable: true, name: 'verifiedId' })
  // verified_by: string;
  

  // @ManyToOne(() => User)
  // verifier: User;

  // @Column({ type: 'timestamp', nullable: true })
  // verified_at: Date;

  // @CreateDateColumn()
  // created_at: Date;

  // @UpdateDateColumn()
  // updated_at: Date;

  // @DeleteDateColumn()
  // deleted_at: Date;
}
