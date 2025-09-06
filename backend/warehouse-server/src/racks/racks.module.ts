import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RacksController } from './racks.controller';
import { RacksService } from './racks.service';
import { Rack } from './rack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rack])],
  controllers: [RacksController],
  providers: [RacksService],
  exports: [RacksService],
})
export class RacksModule {}
