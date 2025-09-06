import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingRequestsController } from './shopping-requests.controller';
import { ShoppingRequestsService } from './shopping-requests.service';
import { ShoppingRequest } from './shopping-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingRequest])],
  controllers: [ShoppingRequestsController],
  providers: [ShoppingRequestsService],
  exports: [ShoppingRequestsService],
})
export class ShoppingRequestsModule {}
