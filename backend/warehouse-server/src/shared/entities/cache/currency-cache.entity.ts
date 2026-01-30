import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currency_cache')
export class CurrencyCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  code: string;

  @Column()
  symbol: string;

  @Column('double precision')
  rate: number;

  @Column('bigint')
  timestamp: number;

  @Column('bigint')
  expiry: number;
}
