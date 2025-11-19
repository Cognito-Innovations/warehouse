import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PackagePieceDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\d{1,7}(\.\d{1,3})?)$/, {
    message:
      'Weight must be a number with up to 7 digits before and 3 digits after the decimal.',
  })
  weight: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @Matches(/^(\d{1,6}(\.\d{1,2})?)$/, {
    message:
      'Length must be a number with up to 6 digits before and 2 digits after the decimal.',
  })
  length?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @Matches(/^(\d{1,6}(\.\d{1,2})?)$/, {
    message:
      'Width must be a number with up to 6 digits before and 2 digits after the decimal.',
  })
  width?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @Matches(/^(\d{1,6}(\.\d{1,2})?)$/, {
    message:
      'Height must be a number with up to 6 digits before and 2 digits after the decimal.',
  })
  height?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @Matches(/^(\d{1,7}(\.\d{1,3})?)$/, {
    message:
      'Volumetric weight must be a number with up to 7 digits before and 3 digits after the decimal.',
  })
  volumetric_weight?: string;
}

export class CreatePackageDto {
  @IsString()
  //TODO: Remove comment
  // @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  rack_slot: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsString()
  @IsNotEmpty()
  tracking_no: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  length?: string;

  @IsString()
  @IsOptional()
  width?: string;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  volumetric_weight?: string;

  @IsBoolean()
  @IsOptional()
  dangerous_good?: boolean;

  @IsBoolean()
  @IsOptional()
  allow_user_items?: boolean;

  @IsBoolean()
  @IsOptional()
  shop_invoice_received?: boolean;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  created_by?: string;

  @IsString()
  @IsOptional()
  package_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackagePieceDto)
  @IsOptional()
  pieces?: PackagePieceDto[];
}
