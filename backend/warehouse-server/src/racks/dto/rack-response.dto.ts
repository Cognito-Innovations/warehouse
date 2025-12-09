import { Expose } from 'class-transformer';
export class RackResponseDto {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  color: string;

  @Expose()
  created_at?: number;

  @Expose()
  updated_at?: number;

  @Expose()
  count: number;
}
