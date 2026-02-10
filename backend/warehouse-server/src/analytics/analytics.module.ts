import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { UsersModule } from 'src/users/users.module';
import { PackagesModule } from 'src/packages/packages.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { PickupRequestsModule } from 'src/pickup-requests/pickup-requests.module';
import { ShoppingRequestsModule } from 'src/shopping-requests/shopping-requests.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    UsersModule,
    PackagesModule,
    ShipmentsModule,
    PickupRequestsModule,
    ShoppingRequestsModule,
    SharedModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
