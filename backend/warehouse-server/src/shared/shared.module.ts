import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
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
    ]),
    CacheModule.registerAsync({
      isGlobal: false,
      useFactory: async () => {
        const redisConfig = { url: process.env.REDIS_URL };
        try {
          const store = await redisStore(redisConfig);
          return {
            store,
            keyPrefix: 'palakart:',
            ttl: 0,
          };
        } catch (error) {
          console.warn(
            'Redis connection failed, falling back to in-memory cache:',
            error,
          );
          return {
            store: 'memory',
            keyPrefix: 'palakart:',
            ttl: 0,
          };
        }
      },
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
  ],
  exports: [
    HttpModule,
    DocumentUploadService,
    CloudinaryService,
    ClientIdentifierService,
    CurrenciesService,
    ExternalCurrencyService,
    DeliveryFeeService,
  ],
})
export class SharedModule {}
