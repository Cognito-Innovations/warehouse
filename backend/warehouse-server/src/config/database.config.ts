import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Country } from '../countries/country.entity';
import { Rack } from '../racks/rack.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { User } from '../users/user.entity';
// import { Package } from '../packages/package.entity';
import { PreArrival } from '../pre-arrivals/pre-arrival.entity';
import { ShoppingRequest } from '../shopping-requests/shopping-request.entity';
import { Product } from '../products/product.entity';
import { PickupRequest } from '../pickup-requests/pickup-request.entity';
import { PackageActionLog } from '../packages/entities/package-action-log.entity';
import { PackageItem } from '../packages/entities/package-item.entity';
import { PackageDocument } from '../packages/entities/package-document.entity';
import { PackageMeasurement } from '../packages/entities/package-measurement.entity';
import { PackageCharge } from '../packages/entities/package-charge.entity';
import { ShipmentExport } from 'src/shipment-export/shipment-export.entity';
import { ShipmentExportBox } from 'src/shipment-export/shipment-export-box.entity';
import {
  UserDocument,
  RackDocument,
  SupplierDocument,
  PreArrivalDocument,
  PickupRequestDocument,
  ShoppingRequestDocument,
} from '../shared/entities';

//TODO: Remove all comments
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'warehouse',
  entities: [
    // Country,
    // Rack,
    // Supplier,
    User,
    // Package,
    // PreArrival,
    ShoppingRequest,
    // Product,
    // PickupRequest,
    // PackageActionLog,
    // PackageItem,
    // PackageDocument,
    // PackageMeasurement,
    // PackageCharge,
    UserDocument,
    // RackDocument,
    // SupplierDocument,
    // PreArrivalDocument,
    // PickupRequestDocument,
    ShoppingRequestDocument,
    ShipmentExport,
    ShipmentExportBox
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Only in development
  logging: process.env.NODE_ENV === 'development',
};
