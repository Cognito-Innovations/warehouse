import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('package_sequence')
@Unique(['country_code', 'year'])
export class PackageSequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 5 })
  country_code: string;

  @Column()
  year: number;

  @Column({ type: 'int', default: 0 })
  last_value: number;
}
