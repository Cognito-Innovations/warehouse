import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateBoxDto } from './create-box.dto';
import { Type } from 'class-transformer';

export class CreateExportDto {
  @IsOptional()
  @IsString()
  mawb?: string;

  @IsNumber()
  boxes_count: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBoxDto)
  boxes?: CreateBoxDto[];
}
