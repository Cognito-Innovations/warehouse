import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseTimestampEntity } from 'src/shared/entities/base-timestamp.entity';

@Entity('countries')
export class Country extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2, unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  phone_code: string;
}
