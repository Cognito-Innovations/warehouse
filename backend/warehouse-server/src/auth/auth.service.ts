import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
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
      },
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '24h',
    };
  }

  async register(
    email: string,
    password: string,
    country: string,
  ): Promise<RegisterResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      country,
      is_logged_in: true,
      last_login: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      country: savedUser.country,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        is_logged_in: true,
        last_login: savedUser.last_login,
        country: savedUser.country,
        created_at: savedUser.created_at,
        last_logout: savedUser.last_logout,
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
