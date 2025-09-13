import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { UsersService } from 'src/users/users.service';
import { Identifier, Gender } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      const payload = { email: existingUser.email, sub: existingUser.id };
      //TODO: GEt the user courierpreferences and update the user
      const access_token = this.jwtService.sign(payload);
      return { access_token, ...existingUser };
    }
    // Check if password is already hashed (from frontend) or needs to be hashed
    const passwordToUse = registerDto.password?.startsWith('$2')
      ? registerDto.password // Already bcrypt hashed (admin registration)
      : await bcrypt.hash(registerDto.password || '', 10); // Hash if not already hashed (admin registration)

    const user = await this.usersService.create({
      ...registerDto,
      password: passwordToUse,
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

    // Check if the stored password is bcrypt hashed or SHA-256 hashed
    let isPasswordValid = false;

    if (user.password.startsWith('$2')) {
      // Password is bcrypt hashed (admin registration or old format)
      isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    } else {
      // Password is SHA-256 hashed (warehouse app registration)
      const hashedInput = crypto
        .createHash('sha256')
        .update(loginDto.password)
        .digest('hex');
      isPasswordValid = hashedInput === user.password;
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.update(userId, {
      last_logout: Math.floor(Date.now() / 1000),
    });

    return { message: 'Logout successful' };
  }
}
