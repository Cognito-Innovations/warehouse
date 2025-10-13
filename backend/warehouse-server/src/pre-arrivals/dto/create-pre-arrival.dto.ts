import { IsString, IsNumber, IsOptional, IsIn, Length } from 'class-validator';

export class CreatePreArrivalDto {
  @IsString()
  @Length(1, 36, { message: 'User name must be between 1 and 36 characters' })
  user: string;

  @IsString()
  @Length(6, 6, { message: 'Suite must be exactly 6 characters' })
  suite: string;

  @IsNumber()
  @Length(4, 4, { message: 'OTP must be exactly 4 characters' })
  otp: number;

  @IsString()
  @Length(10, 14, {
    message: 'Tracking number must be between 10 and 14 characters',
  })
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
