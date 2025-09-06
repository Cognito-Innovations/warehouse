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
  UserDto,
} from './dto/auth-response.dto';

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

    // Update login status
    user.is_logged_in = true;
    user.last_login = new Date();
    await this.userRepository.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      country: user.country,
      role: user.role,
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        is_logged_in: true,
        last_login: user.last_login,
        country: user.country,
        created_at: user.created_at,
        last_logout: user.last_logout,
        role: user.role,
        image: user.image,
        suite_no: user.suite_no,
        identifier: user.identifier,
        phone_number: user.phone_number,
        phone_number_2: user.phone_number_2,
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
    image: string,
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return {
        user: {
          is_logged_in: existingUser.is_logged_in,
          last_login: existingUser.last_login,
          last_logout: existingUser.last_logout,
          created_at: existingUser.created_at,
          updated_at: existingUser.updated_at,
          image: existingUser.image,
          name: existingUser.name,
          role: existingUser.role,
          identifier: existingUser.identifier,
          phone_number: existingUser.phone_number,
          phone_number_2: existingUser.phone_number_2,
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

    //TODO: Remove this country id hardcoded here
    const user = this.userRepository.create({
      country: '54e03123-77f4-477f-85d4-083d4701ae39',
      name,
      image,
      email,
      password: hashedPassword,
      is_logged_in: true,
      last_login: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    const payload = {
      name,
      sub: savedUser.id,
      email: savedUser.email,
      country: savedUser.country,
      image,
      is_logged_in: true,
      last_login: new Date(),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        name,
        updated_at: savedUser.updated_at,
        id: savedUser.id,
        email: savedUser.email,
        is_logged_in: true,
        last_login: savedUser.last_login,
        country: savedUser.country,
        created_at: savedUser.created_at,
        last_logout: savedUser.last_logout,
        role: savedUser.role,
        image: savedUser.image,
        suite_no: savedUser.suite_no,
        identifier: savedUser.identifier,
        phone_number: savedUser.phone_number,
        phone_number_2: savedUser.phone_number_2,
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

    user.is_logged_in = false;
    user.last_logout = new Date();
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
      country: user.country,
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
      image: user.image,
      suite_no: user.suite_no,
      identifier: user.identifier,
      phone_number: user.phone_number,
      phone_number_2: user.phone_number_2,
      gender: user.gender,
      dob: user.dob,
      verified: user.verified,
      updated_at: user.updated_at,
      id: user.id,
      email: user.email,
      is_logged_in: user.is_logged_in,
      last_login: user.last_login,
      last_logout: user.last_logout,
      created_at: user.created_at,
      country: user.country,
    };
  }
}
