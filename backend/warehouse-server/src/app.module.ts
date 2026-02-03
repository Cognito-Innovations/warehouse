import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { databaseConfig } from './config/database.config';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';

import { SharedModule } from './shared/shared.module';
import { ClientIdentifierMiddleware } from './shared/middleware/client-identifier.middleware';
import { ClientIdentifierInterceptor } from './shared/interceptors/client-identifier.interceptor';
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
import { AnalyticsModule } from './analytics/analytics.module';
import { AnalyticsController } from './analytics/analytics.controller';
import { CustomThrottlerGuard } from './shared/guards/custom-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 1 second
        limit: 20, // 20 requests
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.USERNAME,
          pass: process.env.PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.USERNAME}>`,
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
    AnalyticsModule,
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
    AnalyticsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientIdentifierInterceptor,
    },
    ClientIdentifierMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientIdentifierMiddleware).forRoutes('*');
  }
}
