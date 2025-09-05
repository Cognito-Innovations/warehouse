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
import { PackageItemsModule } from './packages/package-items.module';
import { PreArrivalsModule } from './pre-arrivals/pre-arrivals.module';
import { ShoppingRequestsModule } from './shopping-requests/shopping-requests.module';
import { ProductsModule } from './products/products.module';
import { PickupRequestsModule } from './pickup-requests/pickup-requests.module';

import { AppService } from './app.service';

import { AppController } from './app.controller';

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
    PackageItemsModule,
    PreArrivalsModule,
    ShoppingRequestsModule,
    ProductsModule,
    PickupRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
