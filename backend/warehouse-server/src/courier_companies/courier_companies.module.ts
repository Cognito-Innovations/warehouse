import { Module } from '@nestjs/common';
import { CourierCompaniesService } from './courier_companies.service';
import { CourierCompaniesController } from './courier_companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourierCompany } from './courier_company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourierCompany])],
  controllers: [CourierCompaniesController],
  providers: [CourierCompaniesService],
  exports: [CourierCompaniesService],
})
export class CourierCompaniesModule {}
