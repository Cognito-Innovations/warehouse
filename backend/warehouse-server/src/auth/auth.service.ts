import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import {
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
} from './dto/auth-response.dto';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: user.role,
        suite_no: user.suite_no,
        identifier: user.identifier,
        phone_number: user.phone_number,
        alternate_phone_number: user.alternate_phone_number,
        gender: user.gender,
        dob: user.dob,
        updated_at: user.updated_at,
        verified: user.verified,
      },
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '24h',
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return {
        user: {
          created_at: existingUser.created_at,
          updated_at: existingUser.updated_at,
          name: existingUser.name,
          role: existingUser.role,
          identifier: existingUser.identifier,
          phone_number: existingUser.phone_number,
          alternate_phone_number: existingUser.alternate_phone_number,
          suite_no: existingUser.suite_no,
          gender: existingUser.gender,
          dob: existingUser.dob,
          verified: existingUser.verified,
          id: existingUser.id,
          email: existingUser.email,
        },
        accessToken: '',
        tokenType: 'Bearer',
        expiresIn: '24h',
        message: 'User with this email already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = {
      name,
      sub: savedUser.id,
      email: savedUser.email,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at,
      role: savedUser.role,
      suite_no: savedUser.suite_no,
      identifier: savedUser.identifier,
      phone_number: savedUser.phone_number,
      alternate_phone_number: savedUser.alternate_phone_number,
      gender: savedUser.gender,
      dob: savedUser.dob,
      verified: savedUser.verified,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        name,
        id: savedUser.id,
        email: savedUser.email,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
        role: savedUser.role,
        suite_no: savedUser.suite_no,
        identifier: savedUser.identifier,
        phone_number: savedUser.phone_number,
        alternate_phone_number: savedUser.alternate_phone_number,
        gender: savedUser.gender,
        dob: savedUser.dob,
        verified: savedUser.verified,
      },
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '24h',
      message: 'Registration successful',
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.last_logout = Math.floor(Date.now() / 1000);
    await this.userRepository.save(user);

    return { message: 'Logout successful' };
  }

  async refreshToken(userId: string): Promise<RefreshTokenResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '24h',
    };
  }

  async validateUser(userId: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      role: user.role,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      updated_at: user.updated_at,
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };
  }
}
