import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, ShoppingRequestProduct])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
