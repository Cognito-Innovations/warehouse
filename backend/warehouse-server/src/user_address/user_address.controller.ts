import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { CreateUserAddressDto } from './dto/create-user_address.dto';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  create(@Body() createUserAddressDto: CreateUserAddressDto) {
    return this.userAddressService.create(createUserAddressDto);
  }

  @Get()
  findAll() {
    return this.userAddressService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.userAddressService.findByUserId(id);
  }
}
