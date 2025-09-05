import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { databaseConfig } from './config/database.config';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';

import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { RacksModule } from './racks/racks.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PackagesModule } from './packages/packages.module';
import { PackageItemsModule } from './packages/package-items.module';
import { PreArrivalsModule } from './pre-arrivals/pre-arrivals.module';
import { ShoppingRequestsModule } from './shopping-requests/shopping-requests.module';
import { ProductsModule } from './products/products.module';
import { PickupRequestsModule } from './pickup-requests/pickup-requests.module';
import { ShipmentExportModule } from './shipment-export/shipment-export.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';
import { PackageItemsController } from './packages/controller/package-items.controller';
import { PackageDocumentsController } from './packages/controller/package-documents.controller';
import { PreArrivaController } from './pre-arrivals/pre-arrivals.controller';
import { PickupRequestsController } from './pickup-requests/pickup-requests.controller';
import { ShoppingRequestsController } from './shopping-requests/shopping-requests.controller';
import { ProductsController } from './products/products.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    SharedModule,
    UsersModule,
    AuthModule,
    CountriesModule,
    RacksModule,
    SuppliersModule,
    PackagesModule,
    PackageItemsModule,
    PreArrivalsModule,
    ShoppingRequestsModule,
    ProductsModule,
    ShipmentExportModule,
    PickupRequestsModule,
  ],
  controllers: [
    AppController,
    PackageItemsController,
    PackageDocumentsController,
    PreArrivaController,
    PickupRequestsController,
    ShoppingRequestsController,
    ProductsController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
