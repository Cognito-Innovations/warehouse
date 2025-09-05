import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreArrivaController } from './pre-arrivals.controller';
import { PreArrivalService } from './pre-arrivals.service';
import { PreArrival } from './pre-arrival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PreArrival])],
  controllers: [PreArrivaController],
  providers: [PreArrivalService],
  exports: [PreArrivalService],
})
export class PreArrivalsModule {}
