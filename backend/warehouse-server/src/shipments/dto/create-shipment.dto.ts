import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateShipmentDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  packageIds: string[];
}