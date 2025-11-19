import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingRequestProductsController } from './shopping-request-products.controller';
import { ShoppingRequestProductsService } from './shopping-request-products.service';
import { ShoppingRequestProduct } from './shopping-request-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingRequestProduct])],
  controllers: [ShoppingRequestProductsController],
  providers: [ShoppingRequestProductsService],
  exports: [ShoppingRequestProductsService],
})
export class ShoppingRequestProductsModule {}
