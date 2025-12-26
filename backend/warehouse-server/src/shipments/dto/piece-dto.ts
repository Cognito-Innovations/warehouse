import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PieceDto {
  @IsInt()
  @IsPositive()
  piece_number: number;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsNumber()
  @IsPositive()
  length: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsOptional()
  @IsNumber()
  volumetric_weight?: number;
}
