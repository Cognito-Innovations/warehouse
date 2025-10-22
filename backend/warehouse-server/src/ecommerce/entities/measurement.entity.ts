import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ecommerce_measurement')
export class EcommerceMeasurement extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;
}
