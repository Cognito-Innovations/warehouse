import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreatePreArrivalDto {
  @IsString()
  customer: string;

  @IsString()
  suite: string;

  @IsNumber()
  otp: number;

  @IsString()
  tracking_no: string;

  @IsString()
  estimate_arrival_time: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsIn(['pending', 'received'])
  status?: 'pending' | 'received';
}
