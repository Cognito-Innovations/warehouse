import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { PieceDto } from './piece-dto';

export class UpdateShipmentDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  customs_value?: number;

  @IsOptional()
  @IsBoolean()
  dangerous_good?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PieceDto)
  pieces?: PieceDto[];

  @IsOptional()
  @IsString()
  rack_slot?: string;
}
