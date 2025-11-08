import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { databaseConfig } from './config/database.config';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';

import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RacksModule } from './racks/racks.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PackagesModule } from './packages/packages.module';
import { PackageItemsModule } from './packages/package-items.module';
import { PreArrivalsModule } from './pre-arrivals/pre-arrivals.module';
import { ShoppingRequestsModule } from './shopping-requests/shopping-requests.module';
import { ShoppingRequestProductsModule } from './products/shopping-request-products.module';
import { PickupRequestsModule } from './pickup-requests/pickup-requests.module';
import { TrackingRequestsModule } from './tracking-requests/tracking-requests.module';
import { ShipmentExportModule } from './shipment-export/shipment-export.module';

import { PackageItemsController } from './packages/controller/package-items.controller';
import { PackageDocumentsController } from './packages/controller/package-documents.controller';
import { PreArrivaController } from './pre-arrivals/pre-arrivals.controller';
import { PickupRequestsController } from './pickup-requests/pickup-requests.controller';
import { ShoppingRequestsController } from './shopping-requests/shopping-requests.controller';
import { ShoppingRequestProductsController } from './products/shopping-request-products.controller';
import { ShipmentsController } from './shipments/shipments.controller';
import { HealthController } from './health.controller';
import { CourierCompaniesModule } from './courier_companies/courier_companies.module';
import { CountriesModule } from './Countries/countries.module';
import { SupportedCountriesModule } from './supported-countries/supported-countries.module';
import { DocumentsModule } from './documents/documents.module';
import { InvoicesModule } from './invoice/invoices.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { UserAddressModule } from './user_address/user_address.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: 'saurabhpingale93@gmail.com',
          pass: 'umca lcon axee phdf',
        },
      },
      defaults: {
        from: '"No Reply" <saurabhpingale93@gmail.com>',
      },
      template: {
        dir: join(__dirname, '..', 'src', 'users'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot(databaseConfig),
    SharedModule,
    UsersModule,
    UserAddressModule,
    AuthModule,
    CountriesModule,
    CourierCompaniesModule,
    SupportedCountriesModule,
    RacksModule,
    SuppliersModule,
    PackagesModule,
    PackageItemsModule,
    PreArrivalsModule,
    ShoppingRequestsModule,
    ShoppingRequestProductsModule,
    PickupRequestsModule,
    TrackingRequestsModule,
    ShipmentExportModule,
    DocumentsModule,
    InvoicesModule,
    UserPreferencesModule,
    CurrenciesModule,
    EcommerceModule,
    ShipmentsModule,
  ],
  controllers: [
    HealthController,
    PackageItemsController,
    PackageDocumentsController,
    PreArrivaController,
    PickupRequestsController,
    ShoppingRequestsController,
    ShoppingRequestProductsController,
    ShipmentsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
