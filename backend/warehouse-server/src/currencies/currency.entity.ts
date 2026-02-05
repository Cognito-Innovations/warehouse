import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('currencies')
export class Currency extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  currency_symbol: string;

  @Column()
  currency_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  rate: number;
}
