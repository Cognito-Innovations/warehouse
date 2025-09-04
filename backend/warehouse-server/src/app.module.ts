import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { RacksService } from './racks/racks.service';
import { PackagesService } from './packages/packages.service';
import { SuppliersService } from './suppliers/suppliers.service';
import { CountriesService } from './countries/countries.service';
import { PreArrivalService } from './pre-arrivals/pre-arrivals.service';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { RacksController } from './racks/racks.controller';
import { PackagesController } from './packages/packages.controller';
import { SuppliersController } from './suppliers/suppliers.controller';
import { CountriesController } from './countries/countries.controller';
import { PreArrivaController } from './pre-arrivals/pre-arrivals.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController, UsersController, PackagesController, RacksController, SuppliersController, CountriesController, PreArrivaController],
  providers: [AppService, UsersService, PackagesService, RacksService, SuppliersService, CountriesService, PreArrivalService],
})
export class AppModule {}
