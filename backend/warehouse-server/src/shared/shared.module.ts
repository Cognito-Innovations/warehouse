import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from '../packages/entities/package.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';

import { CloudinaryService } from './cloudinary.service';
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadController } from './document-upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PackageDocument, Package]),
  ],
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService, CloudinaryService],
  exports: [DocumentUploadService, CloudinaryService],
})
export class SharedModule {}
