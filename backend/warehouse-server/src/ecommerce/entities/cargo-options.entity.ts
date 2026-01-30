import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum CartCargoStatus {
  EMPTY = 'EMPTY',
  SINGLE = 'SINGLE',
  MIXED = 'MIXED',
}

export interface CartCargoState {
  status: CartCargoStatus;
  cargoLabel: string | null;
}

@Entity('ecommerce_cargo_option')
export class EcommerceCargoOption extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;
}
