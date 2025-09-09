import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '../pickup-request.entity';

class UserInfoDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1-555-123-4567',
  })
  phone_number: string;

  @ApiPropertyOptional({
    description: 'User country',
    example: 'United States',
  })
  country?: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: number;
}

export class PickupRequestResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the pickup request',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Country name where pickup will occur',
    example: 'United States',
  })
  country?: string;

  @ApiProperty({
    description: 'Pickup address where the package should be collected',
    example: '123 Main Street, New York, NY 10001',
  })
  pickup_address: string;

  @ApiProperty({
    description: 'Name of the supplier/vendor',
    example: 'Amazon',
  })
  supplier_name: string;

  @ApiProperty({
    description: 'Primary phone number of the supplier',
    example: '+1-555-123-4567',
  })
  supplier_phone_number: string;

  @ApiPropertyOptional({
    description: 'Alternative phone number of the supplier',
    example: '+1-555-987-6543',
  })
  alt_supplier_phone_number?: string;

  @ApiProperty({
    description: 'Number of pieces/boxes to be picked up',
    example: '2',
  })
  pcs_box: string;

  @ApiPropertyOptional({
    description: 'Estimated weight of the package',
    example: '5.5',
  })
  est_weight?: string;

  @ApiProperty({
    description: 'Details about the package contents',
    example: 'Electronics - Laptop and accessories',
  })
  pkg_details: string;

  @ApiPropertyOptional({
    description: 'Additional remarks or special instructions',
    example: 'Please call before pickup',
  })
  remarks?: string;

  @ApiPropertyOptional({
    description: 'Price for the pickup service',
    example: 25.5,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Status of the pickup request',
    example: 'requested',
  })
  status?: Status;

  @ApiProperty({
    description: 'Current status of the pickup request',
    example: 'requested',
  })
  status: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T14:45:00Z',
  })
  updated_at: number;

  @ApiPropertyOptional({
    description: 'User information who created the request',
    type: UserInfoDto,
  })
  user?: UserInfoDto;
}
