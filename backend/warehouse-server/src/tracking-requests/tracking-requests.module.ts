import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingRequest } from './tracking-request.entity';
import { TrackingRequestsController } from './tracking-requests.controller';
import { TrackingRequestsService } from './tracking-requests.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingRequest]), UsersModule],
  controllers: [TrackingRequestsController],
  providers: [TrackingRequestsService],
  exports: [TrackingRequestsService],
})
export class TrackingRequestsModule {}
