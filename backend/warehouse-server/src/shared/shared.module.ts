import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadController } from './document-upload.controller';
import { CloudinaryService } from './cloudinary.service';
import { Package } from '../packages/entities/package.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';
import {
  UserDocument,
  RackDocument,
  SupplierDocument,
  PreArrivalDocument,
  PickupRequestDocument,
  ShoppingRequestDocument,
  ClientIdentifier,
} from './entities';
import { ClientIdentifierService } from './client-identifier.service';

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
      ClientIdentifier,
    ]),
  ],
  controllers: [DocumentUploadController],
  providers: [
    DocumentUploadService,
    CloudinaryService,
    ClientIdentifierService,
  ],
  exports: [DocumentUploadService, CloudinaryService, ClientIdentifierService],
})
export class SharedModule {}
