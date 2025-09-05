import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Rack } from '../racks/rack.entity';
import { User } from '../users/entity/user.entity';
import { Product } from '../products/product.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Country } from '../countries/entity/country.entity';
import { Package } from 'src/packages/entities/package.entity';
import { PreArrival } from '../pre-arrivals/pre-arrival.entity';
import { PackageItem } from '../packages/entities/package-item.entity';
import { PickupRequest } from '../pickup-requests/pickup-request.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';
import { ShoppingRequest } from '../shopping-requests/shopping-request.entity';
import { PackageActionLog } from '../packages/entities/package-action-log.entity';
import { PackageMeasurement } from '../packages/entities/package-measurement.entity';
import { PackageCharge } from '../packages/entities/package-charge.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'warehouse',
  entities: [
    Country,
    Rack,
    Supplier,
    User,
    Package,
    PreArrival,
    ShoppingRequest,
    Product,
    PickupRequest,
    PackageActionLog,
    PackageItem,
    PackageDocument,
    PackageMeasurement,
    PackageCharge,
  ],
  synchronize: false, // Disable schema synchronization to prevent modifying existing database
  logging: process.env.NODE_ENV === 'development',
};
