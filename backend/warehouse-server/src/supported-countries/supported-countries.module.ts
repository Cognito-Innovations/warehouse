import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupportedCountriesService } from './service/supported-countries.services';
import { SupportedCountriesController } from './supported-countries.controller';
import { SupportedCountry } from './supported-country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportedCountry])],
  controllers: [SupportedCountriesController],
  providers: [SupportedCountriesService],
  exports: [SupportedCountriesService],
})
export class SupportedCountriesModule {}
