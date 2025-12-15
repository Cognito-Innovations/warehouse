import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Length,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreatePreArrivalDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1000, { message: 'OTP must be a 4-digit number' })
  @Max(9999, { message: 'OTP must be a 4-digit number' })
  otp: number;

  @IsString()
  @Length(5, 15, {
    message: 'Tracking number must be between 5 and 15 characters',
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
