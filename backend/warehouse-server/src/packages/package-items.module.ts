import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageItemsService } from './service/package-items.service';
import { PackageItemsController } from './controller/package-items.controller';

import { PackageItem } from './entities/package-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItem])],
  controllers: [PackageItemsController],
  providers: [PackageItemsService],
  exports: [PackageItemsService],
})
export class PackageItemsModule {}
