import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageItemsController } from './package-items.controller';
import { PackageItemsService } from './package-items.service';
import { PackageItem } from './entities/package-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageItem])],
  controllers: [PackageItemsController],
  providers: [PackageItemsService],
  exports: [PackageItemsService],
})
export class PackageItemsModule {}
