import { Module } from '@nestjs/common';
import { PackageDocumentsController } from './package-documents.controller';
import { PackageDocumentsService } from './package-documents.service';

@Module({
  controllers: [PackageDocumentsController],
  providers: [PackageDocumentsService],
  exports: [PackageDocumentsService],
})
export class PackageDocumentsModule {}
