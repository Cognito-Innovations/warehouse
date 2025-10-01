import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  create(createUserAddressDto: CreateUserAddressDto) {
    const userAddress = this.userAddressRepository.create({
      name: createUserAddressDto.name,
      address: createUserAddressDto.address,
      country: createUserAddressDto.country,
      zip_code: createUserAddressDto.zip_code,
      state: createUserAddressDto.state,
      city: createUserAddressDto.city,
      user: { id: createUserAddressDto.user_id },
    });
    return this.userAddressRepository.save(userAddress);
  }

  findAll() {
    return this.userAddressRepository.find();
  }

  findByUserId(id: string) {
    return this.userAddressRepository.findOne({ where: { user: { id } } });
  }
}
