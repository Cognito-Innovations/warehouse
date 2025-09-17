import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingRequestsController } from './shopping-requests.controller';
import { ShoppingRequestsService } from './shopping-requests.service';
import { ShoppingRequest } from './shopping-request.entity';
import { Product } from 'src/products/product.entity';
import { DocumentsModule } from 'src/documents/documents.module';
import { TrackingRequestsModule } from 'src/tracking-requests/tracking-requests.module';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { InvoicesModule } from 'src/invoice/invoices.module';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingRequest, Product, CourierCompany]),
    DocumentsModule,
    TrackingRequestsModule,
    InvoicesModule,
    UserPreferencesModule,
  ],
  controllers: [ShoppingRequestsController],
  providers: [ShoppingRequestsService],
  exports: [ShoppingRequestsService],
})
export class ShoppingRequestsModule {}
