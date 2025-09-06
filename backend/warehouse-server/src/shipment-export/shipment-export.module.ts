import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentExportsController } from './shipment-export.controller';
import { ShipmentExportBoxesController } from './shipment-export-box.controller';
import { ShipmentExportsService } from './shipment-export.service';
import { ShipmentExportBoxesService } from './shipment-export-box.service';
import { ShipmentExport } from './shipment-export.entity';
import { ShipmentExportBox } from './shipment-export-box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipmentExport, ShipmentExportBox])],
  controllers: [ShipmentExportsController, ShipmentExportBoxesController],
  providers: [ShipmentExportsService, ShipmentExportBoxesService],
  exports: [ShipmentExportsService, ShipmentExportBoxesService],
})
export class ShipmentExportModule {}