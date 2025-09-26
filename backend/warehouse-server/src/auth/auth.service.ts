import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { UsersService } from 'src/users/users.service';
import { Identifier, Gender } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    if (registerDto.password) {
      if ((registerDto.password.match(/[a-z]/g) || []).length < 2) {
        throw new BadRequestException(
          'Password must contain at least two lowercase letters',
        );
      }
    }

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      const payload = { email: existingUser.email, sub: existingUser.id };
      const access_token = this.jwtService.sign(payload);
      return { access_token, ...existingUser };
    }

    const user = await this.usersService.create({
      ...registerDto,
      password: registerDto.password as string,
      verified: registerDto.verified ?? false,
      identifier: registerDto.identifier as Identifier,
      gender: registerDto.gender as Gender,
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, ...user };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return { access_token, ...user };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.update(userId, {
      last_logout: Math.floor(Date.now() / 1000),
    });

    return { message: 'Logout successful' };
  }
}
