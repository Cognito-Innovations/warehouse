import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Controller('user-preferences')
export class UserPreferencesController {
  constructor(
    private readonly userPreferencesService: UserPreferencesService,
  ) {}

  @Post()
  create(@Body() createUserPreferenceDto: CreateUserPreferenceDto) {
    return this.userPreferencesService.create(createUserPreferenceDto);
  }

  @Get()
  findAll() {
    return this.userPreferencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPreferencesService.findOne(id);
  }

  @Get('user_currency_rate/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.userPreferencesService.findByUserCurrencyRate(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPreferenceDto: UpdateUserPreferenceDto,
  ) {
    return this.userPreferencesService.update(id, updateUserPreferenceDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userPreferencesService.delete(id);
  }

  @Get('by-user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.userPreferencesService.findByUser(userId);
  }
}
