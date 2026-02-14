import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DocumentUploadService } from './document-upload.service';
import { DocumentUploadController } from './document-upload.controller';
import { CloudinaryService } from './cloudinary.service';
import { Package } from '../packages/entities/package.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';
import {
  UserDocument,
  RackDocument,
  SupplierDocument,
  PreArrivalDocument,
  PickupRequestDocument,
  ShoppingRequestDocument,
  ClientIdentifier,
} from './entities';
import { ClientIdentifierService } from './client-identifier.service';
import { Country } from '../Countries/country.entity';
import { Currency } from '../currencies/currency.entity';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExternalCurrencyService } from './external-currency.service';
import { DeliveryFeeService } from './get-delivery-fee.service';
import { CacheManagerService } from './cache-manager.service';
import { CurrencyCache } from './entities/cache/currency-cache.entity';
import { DeliveryCache } from './entities/cache/delivery-cache.entity';
import { DeliveryOptionCache } from './entities/cache/delivery-option-cache.entity';
import { UserContextService } from './user-context.service';

const cacheModuleFactory = (configService: ConfigService) => ({
  store: redisStore,
  host: configService.get<string>('REDIS_HOST'),
  port: configService.get<number>('REDIS_PORT'),
  keyPrefix: configService.get<string>('REDIS_KEY_PREFIX'),
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Package,
      PackageDocument,
      UserDocument,
      RackDocument,
      SupplierDocument,
      PreArrivalDocument,
      PickupRequestDocument,
      ShoppingRequestDocument,
      ClientIdentifier,
      Country,
      Currency,
      CurrencyCache,
      DeliveryCache,
      DeliveryOptionCache,
    ]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: cacheModuleFactory,
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [DocumentUploadController],
  providers: [
    DocumentUploadService,
    CloudinaryService,
    ClientIdentifierService,
    CurrenciesService,
    ExternalCurrencyService,
    DeliveryFeeService,
    CacheManagerService,
    UserContextService,
  ],
  exports: [
    HttpModule,
    DocumentUploadService,
    CloudinaryService,
    ClientIdentifierService,
    CurrenciesService,
    ExternalCurrencyService,
    DeliveryFeeService,
    CacheManagerService,
    UserContextService,
  ],
})
export class SharedModule {}
