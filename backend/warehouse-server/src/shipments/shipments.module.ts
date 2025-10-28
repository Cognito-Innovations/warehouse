import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.entity';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { Package } from 'src/packages/entities';
import { TrackingRequestsModule } from 'src/tracking-requests/tracking-requests.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { Rack } from 'src/racks/rack.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment, Package, Rack]),
    TrackingRequestsModule,
    DocumentsModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
