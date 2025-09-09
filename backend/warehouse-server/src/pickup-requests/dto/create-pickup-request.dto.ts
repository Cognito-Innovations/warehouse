import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PickupRequestStatus } from '../pickup-request.entity';

export class CreatePickupRequestDto {
  @ApiProperty({
    description: 'User ID who is creating the pickup request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Country ID for the pickup location',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  country_id: string;

  @ApiProperty({
    description: 'Pickup address where the package should be collected',
    example: '123 Main Street, New York, NY 10001',
  })
  @IsString()
  pickup_address: string;

  @ApiProperty({
    description: 'Name of the supplier/vendor',
    example: 'Amazon',
  })
  @IsString()
  supplier_name: string;

  @ApiProperty({
    description: 'Primary phone number of the supplier',
    example: '+1-555-123-4567',
  })
  @IsString()
  supplier_phone_number: string;

  @ApiPropertyOptional({
    description: 'Alternative phone number of the supplier',
    example: '+1-555-987-6543',
  })
  @IsOptional()
  @IsString()
  alt_supplier_phone_number?: string;

  @ApiProperty({
    description: 'Number of pieces/boxes to be picked up',
    example: '2/10',
  })
  @IsString()
  pcs_box: string;

  @ApiPropertyOptional({
    description: 'Estimated weight of the package',
    example: '5.5 kgs',
  })
  @IsOptional()
  @IsString()
  est_weight?: string;

  @ApiProperty({
    description: 'Details about the package contents',
    example: 'Electronics - Laptop and accessories',
  })
  @IsString()
  pkg_details: string;

  @ApiPropertyOptional({
    description: 'Additional remarks or special instructions',
    example: 'Please call before pickup',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: 'Status of the pickup request',
    example: 'REQUESTED',
    enum: ['REQUESTED', 'QUOTED', 'CONFIRMED', 'PICKED'],
  })
  @IsOptional()
  @IsString()
  status?: PickupRequestStatus;
}
