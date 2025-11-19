import { Module } from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from './user-preference.entity';
import { Currency } from 'src/currencies/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreference, Currency])],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
