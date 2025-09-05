import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch,
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../service/users.service';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      country: user.country,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      country: user.country,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      country: user.country,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      country: user.country,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.restore(id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      country: user.country,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
