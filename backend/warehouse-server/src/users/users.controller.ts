import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';

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

  @Get('suite/:suiteNo')
  @ApiOperation({ summary: 'Get user by Suite Number' })
  @ApiParam({
    name: 'suiteNo',
    description: 'User Suite Number',
    example: 'A101',
  })
  @ApiResponse({ status: 200, description: 'User details', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findBySuiteNo(@Param('suiteNo') suiteNo: string): Promise<UserDto> {
    const user = await this.usersService.findBySuiteNo(suiteNo);
    if (!user) {
      throw new NotFoundException(
        `User with suite number ${suiteNo} not found`,
      );
    }
    return this.usersService.mapToUserResponseDto(user);
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
    return this.usersService.mapToUserResponseDto(user);
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
  @Put(':id')
  @ApiOperation({ summary: 'Update user (replace all fields)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UserDto,
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
      role: user.role,
      suite_no: user.suite_no,
      id_card_passport_no: user.id_card_passport_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      email_verified: user.email_verified,
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
      role: user.role,
      name: user.name,
      suite_no: user.suite_no,
      id_card_passport_no: user.id_card_passport_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const { currentPassword, newPassword } = updatePasswordDto;
    return this.usersService.updatePassword(id, currentPassword, newPassword);
  }

  @Post(':id/send-otp')
  @ApiOperation({ summary: 'Send verification OTP to user email' })
  async sendOtp(@Param('id') id: string) {
    return this.usersService.sendVerificationOtp(id);
  }

  @Post(':id/verify-otp')
  @ApiOperation({ summary: 'Verify user email with OTP' })
  async verifyOtp(@Param('id') id: string, @Body('otp') otp: string) {
    const user = await this.usersService.verifyEmailOtp(id, otp);
    return {
      message: 'Email verified successfully.',
      email_verified: user.email_verified,
    };
  }
}
