import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';

import { Package } from './entities/package.entity';
import { PackageItem } from './entities/package-item.entity';
import { PackageDocument } from './entities/package-document.entity';
import { PackageActionLog } from './entities/package-action-log.entity';
import { PackageMeasurement } from './entities/package-measurement.entity';

import { PackagesService } from './service/packages.service';
import { PackageItemsService } from './service/package-items.service';
import { PackageDocumentsService } from './service/package-documents.service';
import { PackageActionLogsService } from './service/package-action-logs.service';

import { PackagesController } from './controller/packages.controller';;


@Module({
  imports: [
    TypeOrmModule.forFeature([Package, PackageActionLog, PackageItem, PackageDocument, PackageMeasurement]),
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
