import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageDocumentsService } from './service/package-documents.service';
import { PackageDocumentsController } from './controller/package-documents.controller';
import { PackageDocument, Package } from './entities';
import { PackageActionLogsService } from './service/package-action-logs.service';
import { DocumentUploadService } from 'src/shared/document-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([PackageDocument, Package])],
  controllers: [PackageDocumentsController],
  providers: [PackageDocumentsService, PackageActionLogsService, DocumentUploadService],
  exports: [PackageDocumentsService],
})
export class PackageDocumentsModule {}
