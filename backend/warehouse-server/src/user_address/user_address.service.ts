import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserAddressDto: CreateUserAddressDto) {
    const userAddress = this.userAddressRepository.create({
      name: createUserAddressDto.name,
      address: createUserAddressDto.address,
      country: createUserAddressDto.country,
      zip_code: createUserAddressDto.zip_code,
      state: createUserAddressDto.state,
      city: createUserAddressDto.city,
      user: { id: createUserAddressDto.user_id },
    });

    const savedAddress = await this.userAddressRepository.save(userAddress);

    await this.userRepository.update(createUserAddressDto.user_id, {
      phone_number: createUserAddressDto.phone_number,
      email: createUserAddressDto.email,
    });

    return savedAddress;
  }

  findAll() {
    return this.userAddressRepository.find();
  }

  findByUserId(id: string) {
    return this.userAddressRepository.findOne({ where: { user: { id } } });
  }
}
