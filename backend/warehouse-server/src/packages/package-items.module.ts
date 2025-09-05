import { Module } from '@nestjs/common';
import { PackageItemsService } from './service/package-items.service';
import { PackageItemsController } from './controller/package-items.controller';


@Module({
  controllers: [PackageItemsController],
  providers: [PackageItemsService],
  exports: [PackageItemsService],
})
export class PackageItemsModule {}
