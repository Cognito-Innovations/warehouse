import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export enum EntityType {
  PACKAGE = 'package',
  USER = 'user',
  RACK = 'rack',
  SUPPLIER = 'supplier',
  PRE_ARRIVAL = 'pre-arrival',
  PICKUP_REQUEST = 'pickup-request',
  SHOPPING_REQUEST = 'shopping-request',
}

export interface DocumentUploadOptions {
  entityType:
    | 'package'
    | 'user'
    | 'rack'
    | 'supplier'
    | 'pre-arrival'
    | 'pickup-request'
    | 'shopping-request';
  entityId: string;
  category?: string;
  isRequired?: boolean;
  uploadedBy: string;
  bucketName?: string;
}

export class DocumentUploadOptionsDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsString()
  uploadedBy: string;

  @IsOptional()
  @IsString()
  bucketName?: string;
}
