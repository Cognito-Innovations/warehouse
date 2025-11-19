import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Shopping request ID this product belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  shopping_request_id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Unit price of the product',
    example: 999.99,
  })
  unit_price?: string;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
  })
  currency?: string | null;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 1,
  })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Product URL',
    example: 'https://example.com/product',
  })
  url?: string;

  @ApiPropertyOptional({
    description: 'Product size',
    example: 'Large',
  })
  size?: string;

  @ApiPropertyOptional({
    description: 'Product color',
    example: 'Space Black',
  })
  color?: string;

  @ApiPropertyOptional({
    description: 'Product variants',
    example: '256GB Storage',
  })
  variants?: string;

  @ApiPropertyOptional({
    description: 'Alternative quantity if not available',
    example: '2',
  })
  if_not_available_quantity?: string;

  @ApiPropertyOptional({
    description: 'Alternative color if not available',
    example: 'Silver',
  })
  if_not_available_color?: string;

  @ApiPropertyOptional({
    description: 'Product availability status',
    example: true,
  })
  available?: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: 1640995200000,
  })
  created_at: number;

  @ApiProperty({
    description: 'Last update timestamp',
    example: 1640995200000,
  })
  updated_at: number;
}
