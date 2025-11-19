import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingRequestsController } from './shopping-requests.controller';
import { ShoppingRequestsService } from './shopping-requests.service';
import { ShoppingRequest } from './shopping-request.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';
import { DocumentsModule } from 'src/documents/documents.module';
import { TrackingRequestsModule } from 'src/tracking-requests/tracking-requests.module';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { InvoicesModule } from 'src/invoice/invoices.module';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingRequest,
      ShoppingRequestProduct,
      CourierCompany,
    ]),
    DocumentsModule,
    TrackingRequestsModule,
    InvoicesModule,
    UserPreferencesModule,
    UsersModule,
  ],
  controllers: [ShoppingRequestsController],
  providers: [ShoppingRequestsService],
  exports: [ShoppingRequestsService],
})
export class ShoppingRequestsModule {}
