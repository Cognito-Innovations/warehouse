import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { Package } from './package.entity';
import { PackageActionLog } from './entities/package-action-log.entity';
import { PackageItem } from './entities/package-item.entity';
import { PackageDocument } from './entities/package-document.entity';
import { PackageActionLogsService } from './package-action-logs.service';
import { PackageItemsService } from './package-items.service';
import { PackageDocumentsService } from './package-documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package,
      PackageActionLog,
      PackageItem,
      PackageDocument,
    ]),
    SharedModule,
  ],
  controllers: [PackagesController],
  providers: [
    PackagesService,
    PackageActionLogsService,
    PackageItemsService,
    PackageDocumentsService,
  ],
  exports: [
    PackagesService,
    PackageActionLogsService,
    PackageItemsService,
    PackageDocumentsService,
  ],
})
export class PackagesModule {}
