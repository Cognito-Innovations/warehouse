import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/service/users.service';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthResponseDto } from '../dto/AuthResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password || '', 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        suite_no: user.suite_no,
        country: user.country,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update login status
    await this.usersService.update(user.id, {
      is_logged_in: true,
      last_login: new Date(),
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        suite_no: user.suite_no,
        country: user.country,
      },
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Update logout status
    await this.usersService.update(userId, {
      is_logged_in: false,
      last_logout: new Date(),
    });

    return { message: 'Logout successful' };
  }
}
