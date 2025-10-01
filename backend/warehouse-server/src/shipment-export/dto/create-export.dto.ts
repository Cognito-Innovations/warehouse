import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateBoxDto } from './create-box.dto';
import { Type } from 'class-transformer';

export class CreateExportDto {
  @IsString()
  export_code: string;

  @IsOptional()
  @IsString()
  mawb?: string;

  @IsNumber()
  boxes_count: number;

  @IsString()
  created_by: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBoxDto)
  boxes?: CreateBoxDto[];
}
