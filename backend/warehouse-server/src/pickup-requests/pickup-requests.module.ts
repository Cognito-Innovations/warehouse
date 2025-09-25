import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickupRequestsController } from './pickup-requests.controller';
import { PickupRequestsService } from './pickup-requests.service';
import { PickupRequest } from './pickup-request.entity';
import { TrackingRequest } from '../tracking-requests/tracking-request.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { SharedModule } from 'src/shared/shared.module';
import { TrackingRequestsModule } from 'src/tracking-requests/tracking-requests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PickupRequest, TrackingRequest, UserPreference]),
    SharedModule,
    TrackingRequestsModule
  ],
  controllers: [PickupRequestsController],
  providers: [PickupRequestsService, UserPreferencesService],
  exports: [PickupRequestsService],
})
export class PickupRequestsModule {}
