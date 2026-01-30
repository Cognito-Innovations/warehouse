import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoriesController } from './controllers/ecommerce-categories.controller';
import { SubCategoriesController } from './controllers/ecommerce-sub-categories.controller';
import { ProductsController } from './controllers/ecommerce-products.controller';
import { CartController } from './controllers/ecommerce-cart.controller';
import { OrderController } from './controllers/ecommerce-order.controller';
import { CategoriesService } from './services/ecommerce-categories.service';
import { SubCategoriesService } from './services/ecommerce-sub-categories.service';
import { ProductsService } from './services/ecommerce-products.service';
import { CartService } from './services/ecommerce-cart.service';
import { OrderService } from './services/ecommerce-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcommerceCategory } from './entities/ecommerce-category.entity';
import { EcommerceSubCategory } from './entities/ecommerce-sub-category.entity';
import { EcommerceProduct } from './entities/ecommerce-product.entity';
import { EcommerceMeasurement } from './entities/measurement.entity';
import { MeasurementController } from './controllers/measurement.controller';
import { MeasurementService } from './services/measurement.service';
import { Country } from 'src/Countries/country.entity';
import { EcommerceCargoOption } from './entities/cargo-options.entity';
import { CargoOptionsController } from './controllers/cargoOptions.controller';
import { CargoOptionsService } from './services/cargo-options.service';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';
import { Currency } from 'src/currencies/currency.entity';
import { SharedModule } from 'src/shared/shared.module';
import { EcommerceUserProductStatus } from './entities/ecommerce_user_products_status.entity';
import { EcommercePayment } from './entities/ecommerce-payments.entity';
import { EcommerceOrderReference } from './entities/ecommerce-order-references.entity';
import { PaymentService } from './services/payment.service';
import { EcommerceUserDeliverySelection } from './entities/ecommerce_user_delivery_selections.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      EcommerceCategory,
      EcommerceSubCategory,
      EcommerceProduct,
      EcommerceUserProductStatus,
      EcommercePayment,
      EcommerceOrderReference,
      EcommerceMeasurement,
      Country,
      EcommerceCargoOption,
      Currency,
      EcommerceUserDeliverySelection,
    ]),
    UserPreferencesModule,
    SharedModule,
  ],
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProductsController,
    CartController,
    OrderController,
    MeasurementController,
    CargoOptionsController,
  ],
  providers: [
    CategoriesService,
    SubCategoriesService,
    ProductsService,
    CartService,
    OrderService,
    MeasurementService,
    CargoOptionsService,
    PaymentService,
  ],
})
export class EcommerceModule {}
