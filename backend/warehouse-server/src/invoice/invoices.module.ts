import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';
import { Package } from 'src/packages/entities';
import { InvoiceCharge } from './entities/invoice-charge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      ShoppingRequestProduct,
      Package,
      InvoiceCharge,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
