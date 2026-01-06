import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Country } from 'src/Countries/country.entity';
import { UserPreferencesModule } from 'src/user-preferences/user-preferences.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Country]), UserPreferencesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
