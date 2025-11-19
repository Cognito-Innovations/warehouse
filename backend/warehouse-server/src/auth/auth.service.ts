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
      if (registerDto.identifier !== Identifier.Google) {
        if (existingUser.password) {
          throw new ConflictException(
            'User with this email already exists. Please log in.'
          );
        }
        if (registerDto.password) {
          const hashedPassword = await bcrypt.hash(registerDto.password, 10);
          await this.usersService.update(existingUser.id, {
            password: hashedPassword,
            identifier: Identifier.Email,
          });
        }
      }
      
      const payload = { email: existingUser.email, sub: existingUser.id };
      const access_token = this.jwtService.sign(payload);
      return {
        access_token,
        ...this.usersService.mapToUserResponseDto(existingUser),
      };
    }
    
    let hashedPassword: string | undefined = undefined;
    if (registerDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(registerDto.password, salt);
    }

    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword!,
      verified: registerDto.verified ?? false,
      identifier:
        registerDto.identifier === Identifier.Google
          ? Identifier.Google
          : Identifier.Email,
      gender: registerDto.gender as Gender,
    });

    const payload = { email: newUser.email, sub: newUser.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token, ...newUser };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
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

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return { 
      access_token, 
      user: this.usersService.mapToUserResponseDto(user),
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.usersService.update(userId, {
      last_logout: Math.floor(Date.now() / 1000),
    });

    return { message: 'Logout successful' };
  }
}
