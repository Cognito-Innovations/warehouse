import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user_address.dto';
import { Repository } from 'typeorm';
import { UserAddress } from './user_address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UpdateUserAddressDto } from './dto/update-user_address.dto';
import { UserPreference } from 'src/user-preferences/user-preference.entity';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreference)
    private userPreferenceRepository: Repository<UserPreference>,
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

    if (
      createUserAddressDto.phone_code ||
      createUserAddressDto.phone_number ||
      createUserAddressDto.email
    ) {
      const userUpdates: Partial<User> = {};

      if (createUserAddressDto.phone_code) {
        userUpdates.phone_code = createUserAddressDto.phone_code;
      }

      if (createUserAddressDto.phone_number) {
        userUpdates.phone_number = createUserAddressDto.phone_number;
      }

      if (createUserAddressDto.email) {
        userUpdates.email = createUserAddressDto.email;
      }

      await this.userRepository.update(
        createUserAddressDto.user_id,
        userUpdates,
      );
    }

    if (createUserAddressDto.currency) {
      const existingPref = await this.userPreferenceRepository.findOne({
        where: { user: { id: createUserAddressDto.user_id } },
      });

      if (existingPref) {
        await this.userPreferenceRepository.save({
          ...existingPref,
          currency: { id: createUserAddressDto.currency },
        });
      }
    }

    return this.userAddressRepository.findOne({
      where: { id: savedAddress.id },
      relations: ['user', 'user.preference', 'user.preference.currency'],
    });
  }

  findAll() {
    return this.userAddressRepository.find({
      relations: ['user', 'user.preference', 'user.preference.currency'],
    });
  }

  findByUserId(id: string) {
    return this.userAddressRepository.findOne({
      where: { user: { id } },
      relations: ['user', 'user.preference', 'user.preference.currency'],
    });
  }

  async update(id: string, updateUserAddressDto: UpdateUserAddressDto) {
    const existingAddress = await this.userAddressRepository.findOne({
      where: { id },
      relations: ['user', 'user.preference', 'user.preference.currency'],
    });
    if (!existingAddress) {
      throw new NotFoundException(`User address with ID ${id} not found`);
    }

    const addressUpdates = {
      name: updateUserAddressDto.name,
      address: updateUserAddressDto.address,
      country: updateUserAddressDto.country,
      zip_code: updateUserAddressDto.zip_code,
      state: updateUserAddressDto.state,
      city: updateUserAddressDto.city,
    };

    await this.userAddressRepository.update(id, addressUpdates);

    if (
      updateUserAddressDto.phone_code ||
      updateUserAddressDto.phone_number ||
      updateUserAddressDto.email
    ) {
      const userUpdates: Partial<User> = {};
      if (updateUserAddressDto.phone_code) {
        userUpdates.phone_code = updateUserAddressDto.phone_code;
      }
      if (updateUserAddressDto.phone_number) {
        userUpdates.phone_number = updateUserAddressDto.phone_number;
      }
      if (updateUserAddressDto.email) {
        userUpdates.email = updateUserAddressDto.email;
      }
      await this.userRepository.update(existingAddress.user.id, userUpdates);
    }

    if (updateUserAddressDto.currency) {
      const existingPref = await this.userPreferenceRepository.findOne({
        where: { user: { id: existingAddress.user.id } },
      });

      if (existingPref) {
        await this.userPreferenceRepository.save({
          ...existingPref,
          currency: { id: updateUserAddressDto.currency },
        });
      }
    }

    return this.userAddressRepository.findOne({
      where: { id },
      relations: ['user', 'user.preference', 'user.preference.currency'],
    });
  }
}
