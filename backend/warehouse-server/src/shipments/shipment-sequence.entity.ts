import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('shipment_sequence')
@Unique(['country_code', 'year'])
export class ShipmentSequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 5 })
  country_code: string;

  @Column()
  year: number;

  @Column({ type: 'int', default: 0 })
  last_value: number;
}
