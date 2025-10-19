import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/ecommerce-categories.controller';
import { SubCategoriesController } from './controllers/ecommerce-sub-categories.controller';
import { CategoriesService } from './services/ecommerce-categories.service';
import { SubCategoriesService } from './services/ecommerce-sub-categories.service';
import { ProductsService } from './services/ecommerce-products.service';
import { ProductsController } from './controllers/ecommerce-products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcommerceCategory } from './entities/ecommerce-category.entity';
import { EcommerceSubCategory } from './entities/ecommerce-sub-category.entity';
import { EcommerceProduct } from './entities/ecommerce-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EcommerceCategory,
      EcommerceSubCategory,
      EcommerceProduct,
    ]),
  ],
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProductsController,
  ],
  providers: [CategoriesService, SubCategoriesService, ProductsService],
})
export class EcommerceModule {}
