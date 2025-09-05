import { Module } from '@nestjs/common';
import { PackageDocumentsService } from './service/package-documents.service';
import { PackageDocumentsController } from './controller/package-documents.controller';


@Module({
  controllers: [PackageDocumentsController],
  providers: [PackageDocumentsService],
  exports: [PackageDocumentsService],
})
export class PackageDocumentsModule {}
