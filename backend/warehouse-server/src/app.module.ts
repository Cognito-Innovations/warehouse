import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { RacksModule } from './racks/racks.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PackagesModule } from './packages/packages.module';

import { AppService } from './app.service';
import { PackageItemsService } from './packages/package-items.service';
import { PackageDocumentsService } from './packages/package-documents.service';
import { PackageActionLogsService } from './packages/package-action-logs.service';
import { PreArrivalService } from './pre-arrivals/pre-arrivals.service';
import { PickupRequestsService } from './pickup-requests/pickup-requests.service';
import { ShoppingRequestsService } from './shopping-requests/shopping-requests.service';
import { ProductsService } from './products/products.service';

import { AppController } from './app.controller';
import { PackageItemsController } from './packages/package-items.controller';
import { PackageDocumentsController } from './packages/package-documents.controller';
import { PreArrivaController } from './pre-arrivals/pre-arrivals.controller';
import { PickupRequestsController } from './pickup-requests/pickup-requests.controller';
import { ShoppingRequestsController } from './shopping-requests/shopping-requests.controller';
import { ProductsController } from './products/products.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    SharedModule,
    UsersModule,
    CountriesModule,
    RacksModule,
    SuppliersModule,
    PackagesModule,
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
    PackageItemsService,
    PackageDocumentsService,
    PackageActionLogsService,
    PreArrivalService,
    PickupRequestsService,
    ShoppingRequestsService,
    ProductsService,
  ],
})
export class AppModule {}
