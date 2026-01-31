import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ecommerce_cargo_option')
export class EcommerceCargoOption extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;
}
