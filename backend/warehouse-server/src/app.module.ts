import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { PackagesService } from './packages/packages.service';
import { RacksService } from './racks/racks.service';
import { SuppliersService } from './suppliers/suppliers.service';
import { CountriesService } from './countries/countries.service';

import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { PackagesController } from './packages/packages.controller';
import { RacksController } from './racks/racks.controller';
import { SuppliersController } from './suppliers/suppliers.controller';
import { CountriesController } from './countries/countries.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    UsersController,
    PackagesController,
    RacksController,
    SuppliersController,
    CountriesController,
  ],
  providers: [
    AppService,
    UsersService,
    PackagesService,
    RacksService,
    SuppliersService,
    CountriesService,
  ],
})
export class AppModule {}
