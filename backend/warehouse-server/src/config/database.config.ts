import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Rack } from '../racks/rack.entity';
import { User } from '../users/user.entity';
import { ShoppingRequestProduct } from '../products/shopping-request-product.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { Package } from '../packages/entities/package.entity';
import { PreArrival } from '../pre-arrivals/pre-arrival.entity';
import { PackageItem } from '../packages/entities/package-item.entity';
import { PickupRequest } from '../pickup-requests/pickup-request.entity';
import { ShoppingRequest } from '../shopping-requests/shopping-request.entity';
import { TrackingRequest } from '../tracking-requests/tracking-request.entity';
import { PackageActionLog } from '../packages/entities/package-action-log.entity';
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
  ClientIdentifier,
} from '../shared/entities';
import { Country } from 'src/Countries/country.entity';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { Document } from 'src/documents/documents.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Currency } from 'src/currencies/currency.entity';
import { UserPreference } from 'src/user-preferences/user-preference.entity';
import { SupportedCountry } from 'src/supported-countries/supported-country.entity';
import { UserAddress } from 'src/user_address/user_address.entity';
import { EcommerceSubCategory } from 'src/ecommerce/entities/ecommerce-sub-category.entity';
import { EcommerceCategory } from 'src/ecommerce/entities/ecommerce-category.entity';
import { EcommerceProduct } from 'src/ecommerce/entities/ecommerce-product.entity';
import { EcommerceMeasurement } from 'src/ecommerce/entities/measurement.entity';
import { Shipment } from 'src/shipments/shipment.entity';
import { InvoiceCharge } from 'src/invoice/entities/invoice-charge.entity';
import { EcommerceCargoOption } from 'src/ecommerce/entities/cargo-options.entity';
import { ShipmentPiece } from 'src/shipments/shipment-piece.entity';
import { ShipmentSequence } from 'src/shipments/shipment-sequence.entity';
import { PackageSequence } from 'src/packages/entities/package-sequence.entity';
import { EcommerceUserItem } from 'src/ecommerce/entities/ecommerce-user-items.entity';
import { EcommercePayment } from 'src/ecommerce/entities/ecommerce-payments.entity';
import { EcommerceOrderReference } from 'src/ecommerce/entities/ecommerce-order-references.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'warehouse',
  entities: [
    Country,
    Currency,
    SupportedCountry,
    UserPreference,
    CourierCompany,
    UserAddress,
    Rack,
    Supplier,
    User,
    Package,
    PreArrival,
    ShoppingRequest,
    ShoppingRequestProduct,
    PickupRequest,
    TrackingRequest,
    PackageActionLog,
    PackageItem,
    PackageDocument,
    PackageMeasurement,
    PackageCharge,
    UserDocument,
    RackDocument,
    SupplierDocument,
    PreArrivalDocument,
    PickupRequestDocument,
    ShoppingRequestDocument,
    ClientIdentifier,
    ShipmentExport,
    ShipmentExportBox,
    Document,
    Invoice,
    EcommerceCategory,
    EcommerceSubCategory,
    EcommerceProduct,
    EcommerceUserItem,
    EcommercePayment,
    EcommerceOrderReference,
    EcommerceMeasurement,
    Shipment,
    ShipmentPiece,
    InvoiceCharge,
    EcommerceCargoOption,
    ShipmentSequence,
    PackageSequence,
  ],
  synchronize: false, // Disable schema synchronization to prevent modifying existing database
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  logging: false,
};
