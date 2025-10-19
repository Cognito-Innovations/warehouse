import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { SubCategoriesController } from './controllers/sub_categories.controller';
import { CategoriesService } from './services/categories.service';
import { SubCategoriesService } from './services/sub_categories.service';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub_category.entity';
import { EcommerceProduct } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, SubCategory, EcommerceProduct]),
  ],
  controllers: [
    CategoriesController,
    SubCategoriesController,
    ProductsController,
  ],
  providers: [CategoriesService, SubCategoriesService, ProductsService],
})
export class EcommerceModule {}
