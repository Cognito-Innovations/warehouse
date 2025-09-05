import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { RacksService } from './racks/racks.service';
import { PackagesService } from './packages/packages.service';
import { SuppliersService } from './suppliers/suppliers.service';
import { CountriesService } from './countries/countries.service';
import { PackageItemsService } from './packages/package-items.service';
import { PackageDocumentsService } from './packages/package-documents.service';
import { PackageActionLogsService } from './packages/package-action-logs.service';
import { PreArrivalService } from './pre-arrivals/pre-arrivals.service';
import { PickupRequestsService } from './pickup-requests/pickup-requests.service';
import { ShoppingRequestsService } from './shopping-requests/shopping-requests.service';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { RacksController } from './racks/racks.controller';
import { PackagesController } from './packages/packages.controller';
import { PackageItemsController } from './packages/package-items.controller';
import { PackageDocumentsController } from './packages/package-documents.controller';
import { SuppliersController } from './suppliers/suppliers.controller';
import { CountriesController } from './countries/countries.controller';
import { PreArrivaController } from './pre-arrivals/pre-arrivals.controller';
import { PickupRequestsController } from './pickup-requests/pickup-requests.controller';
import { ShoppingRequestsController } from './shopping-requests/shopping-requests.controller';

@Module({
  imports: [AuthModule, SharedModule],
  controllers: [AppController, UsersController, PackagesController, PackageItemsController, PackageDocumentsController, RacksController, SuppliersController, CountriesController, PreArrivaController, PickupRequestsController, ShoppingRequestsController],
  providers: [AppService, UsersService, PackagesService, PackageItemsService, PackageDocumentsService, PackageActionLogsService, RacksService, SuppliersService, CountriesService, PreArrivalService, PickupRequestsService, ShoppingRequestsService],
})
export class AppModule {}
