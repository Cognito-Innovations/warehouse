import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'User ID',
    example: '134a9aaa-6205-428a-be00-bfabc72c984c',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Address name/label',
    example: 'Home Address',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Country',
    example: 'India',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'ZIP/Postal code',
    example: '33233',
  })
  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @ApiProperty({
    description: 'State/Province',
    example: 'Karnataka',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'City',
    example: 'Bangalore',
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}
