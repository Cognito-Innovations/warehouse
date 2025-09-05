import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadController } from './document-upload.controller';
import { CloudinaryService } from './cloudinary.service';
import { Package } from '../packages/package.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';
import {
  UserDocument,
  RackDocument,
  SupplierDocument,
  PreArrivalDocument,
  PickupRequestDocument,
  ShoppingRequestDocument,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package,
      PackageDocument,
      UserDocument,
      RackDocument,
      SupplierDocument,
      PreArrivalDocument,
      PickupRequestDocument,
      ShoppingRequestDocument,
    ]),
  ],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService, CloudinaryService],
  exports: [DocumentUploadService, CloudinaryService],
})
export class SharedModule {}
