import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsBoolean } from 'class-validator';
import { Country } from 'src/Countries/country.entity';

export class SupportedCountryCreateDto {
  @ApiProperty({
    description: 'Country object',
    example: { id: 'country-uuid', code: 'IN', name: 'India' },
  })
  @IsObject()
  @IsNotEmpty()
  country: Country;

  @ApiProperty({ description: 'Whether the country is active', example: true })
  @IsBoolean()
  is_active: boolean;
}
