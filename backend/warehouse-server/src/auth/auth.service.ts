import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { UsersService } from 'src/users/users.service';
import { Identifier, Gender } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/user.entity';

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

    const existingUser = await this.usersService.findByEmailWithPassword(
      registerDto.email,
    );

    if (existingUser) {
      if (registerDto.identifier !== Identifier.Google) {
        if (existingUser.password) {
          throw new ConflictException(
            'User with this email already exists. Please log in.',
          );
        }
        if (registerDto.password) {
          const hashedPassword = await bcrypt.hash(registerDto.password, 10);
          await this.usersService.update(existingUser.id, {
            password: hashedPassword,
            identifier: Identifier.Email,
            shouldHashPassword: false,
          });
          const user = await this.usersService.findById(existingUser.id);
          const payload = { email: user?.email, sub: user?.id };
          const access_token = this.jwtService.sign(payload);
          return {
            access_token,
            ...user,
          };
        }
      }

      (existingUser as any).password = undefined;
      const payload = { email: existingUser.email, sub: existingUser.id };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        ...existingUser,
      };
    }

    let hashedPassword: string | undefined = undefined;
    if (registerDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(registerDto.password, salt);
    }

    const newUser = await this.usersService.create({
      ...registerDto,
      role: registerDto.role as Role,
      password: hashedPassword!,
      verified: registerDto.verified ?? false,
      identifier:
        registerDto.identifier === Identifier.Google
          ? Identifier.Google
          : Identifier.Email,
      gender: registerDto.gender as Gender,
      shouldHashPassword: false,
    });

    const payload = { email: newUser.email, sub: newUser.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, ...newUser };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmailWithPassword(
      loginDto.email,
    );
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    (user as any).password = undefined;

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.update(userId, {
      last_logout: Math.floor(Date.now() / 1000),
    });

    return { message: 'Logout successful' };
  }
}
