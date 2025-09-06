import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingRequestsController } from './shopping-requests.controller';
import { ShoppingRequestsService } from './shopping-requests.service';
import { ShoppingRequest } from './shopping-request.entity';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingRequest, Product])],
  controllers: [ShoppingRequestsController],
  providers: [ShoppingRequestsService],
  exports: [ShoppingRequestsService],
})
export class ShoppingRequestsModule {}
