import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageItemsService } from './service/package-items.service';
import { PackageItemsController } from './controller/package-items.controller';

import { PackageItem } from './entities/package-item.entity';
import { Package } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItem, Package])],
  controllers: [PackageItemsController],
  providers: [PackageItemsService],
  exports: [PackageItemsService],
})
export class PackageItemsModule {}
