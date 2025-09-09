import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickupRequestsController } from './pickup-requests.controller';
import { PickupRequestsService } from './pickup-requests.service';
import { PickupRequest } from './pickup-request.entity';
import { TrackingRequest } from '../tracking-requests/tracking-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PickupRequest, TrackingRequest])],
  controllers: [PickupRequestsController],
  providers: [PickupRequestsService],
  exports: [PickupRequestsService],
})
export class PickupRequestsModule {}
