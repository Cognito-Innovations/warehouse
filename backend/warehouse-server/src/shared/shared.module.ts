import { Module } from '@nestjs/common';
import { DocumentUploadController } from './document-upload.controller';
import { DocumentUploadService } from './document-upload.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  controllers: [DocumentUploadController],
  providers: [DocumentUploadService, CloudinaryService],
  exports: [DocumentUploadService, CloudinaryService],
})
export class SharedModule {}
