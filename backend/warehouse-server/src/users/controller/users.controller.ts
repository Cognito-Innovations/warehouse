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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../service/users.service';
import { UserDto } from '../dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserDto],
  })
  async findAll(): Promise<UserDto[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      Example1: {
        summary: 'Create user with email and password',
        value: {
          email: 'jane.doe@example.com',
          password: 'SecurePass123',
          name: 'Jane Doe',
          phone_number: '+1234567890',
          gender: 'female',
          dob: '1990-05-10',
          verified: true,
          country: 'USA',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
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
  @ApiOperation({ summary: 'Update user (replace all fields)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      Example1: {
        summary: 'Update user email and phone',
        value: {
          email: 'new.email@example.com',
          phone_number: '+9876543210',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
  @ApiOperation({ summary: 'Partially update user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      Example1: {
        summary: 'Update only user name',
        value: {
          name: 'Jane Updated',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User partially updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
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
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted user' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or not deleted',
  })
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
