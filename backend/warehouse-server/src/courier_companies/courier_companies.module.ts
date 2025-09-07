import { Module } from '@nestjs/common';
import { CourierCompaniesService } from './courier_companies.service';
import { CourierCompaniesController } from './courier_companies.controller';

@Module({
  controllers: [CourierCompaniesController],
  providers: [CourierCompaniesService],
})
export class CourierCompaniesModule {}
