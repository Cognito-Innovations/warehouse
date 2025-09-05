import { Module } from '@nestjs/common';
import { PackageItemsController } from './package-items.controller';
import { PackageItemsService } from './package-items.service';

@Module({
  controllers: [PackageItemsController],
  providers: [PackageItemsService],
  exports: [PackageItemsService],
})
export class PackageItemsModule {}
