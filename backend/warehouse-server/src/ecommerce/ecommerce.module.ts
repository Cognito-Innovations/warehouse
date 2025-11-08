import { Module } from '@nestjs/common';
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
import { EcommerceCart } from './entities/ecommerce-cart.entity';
import { EcommerceCartItem } from './entities/ecommerce-cart-item.entity';
import { EcommerceOrder } from './entities/ecommerce-order.entity';
import { EcommerceOrderItem } from './entities/ecommerce-order-item.entity';
import { EcommerceMeasurement } from './entities/measurement.entity';
import { MeasurementController } from './controllers/measurement.controller';
import { MeasurementService } from './services/measurement.service';
import { Country } from 'src/Countries/country.entity';
import { SeedController } from './seed/seed.controller';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EcommerceCategory,
      EcommerceSubCategory,
      EcommerceProduct,
      EcommerceCart,
      EcommerceCartItem,
      EcommerceOrder,
      EcommerceOrderItem,
      EcommerceMeasurement,
      EcommerceCartItem,
      Country,
    ]),
  ],
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProductsController,
    CartController,
    OrderController,
    MeasurementController,
    SeedController,
  ],
  providers: [
    CategoriesService,
    SubCategoriesService,
    ProductsService,
    CartService,
    OrderService,
    MeasurementService,
    SeedService,
  ],
})
export class EcommerceModule {}
