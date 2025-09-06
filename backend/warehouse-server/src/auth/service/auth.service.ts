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
    console.log('Register called with:', { email: registerDto.email, name: registerDto.name });
    
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      console.log('User exists, updating:', existingUser.id);
      // If user exists, update their info and return JWT token
      const updatedUser = await this.usersService.update(existingUser.id, {
        name: registerDto.name,
        image: registerDto.image,
        country: existingUser.country || 'India', // Set default country if not set
        is_logged_in: true,
        last_login: new Date(),
      });

      // Generate JWT token for existing user
      const payload = { email: updatedUser.email, sub: updatedUser.id };
      const access_token = this.jwtService.sign(payload);
      
      console.log('Generated JWT token for existing user:', access_token.substring(0, 20) + '...');

      return {
        access_token,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          suite_no: updatedUser.suite_no,
          country: updatedUser.country,
        },
      };
    }

    console.log('Creating new user');
    const hashedPassword = await bcrypt.hash(registerDto.password || '', 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      country: registerDto.country || 'India', // Set default country to India
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    
    console.log('Generated JWT token for new user:', access_token.substring(0, 20) + '...');

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
