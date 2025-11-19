import { Module } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { UserAddressController } from './user_address.controller';
import { UserAddress } from './user_address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress, User])],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
