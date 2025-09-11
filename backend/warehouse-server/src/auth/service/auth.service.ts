import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UsersService } from '../../users/service/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from '../dto/AuthResponseDto';
import { Country } from 'src/Countries/country.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    console.log('Register called with:', {
      email: registerDto.email,
      name: registerDto.name,
    });

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    let countryEntity: Country | null = null;
    if (registerDto.country) {
      countryEntity = await this.usersService.findCountryByName(
        registerDto.country,
      );
      if (!countryEntity) {
        throw new Error(`Country ${registerDto.country} not found`);
      }
    } else {
      // Fallback default to "India"
      countryEntity = await this.usersService.findCountryByName('India');
      if (!countryEntity) {
        throw new Error(`Default country India not found in DB`);
      }
    }
    if (existingUser) {
      const updatedUser = await this.usersService.update(existingUser.id, {
        name: registerDto.name,
        image: registerDto.image,
        country: countryEntity.id,
        is_logged_in: true,
        last_login: new Date(),
      });

      // Generate JWT token for existing user
      const payload = { email: updatedUser.email, sub: updatedUser.id };
      const access_token = this.jwtService.sign(payload);

      console.log(
        'Generated JWT token for existing user:',
        access_token.substring(0, 20) + '...',
      );

      return {
        access_token,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          suite_no: updatedUser.suite_no,
          country: updatedUser.country?.name,
          verified: updatedUser.verified,
        },
      };
    }

    console.log('Creating new user');
    // Check if password is already hashed (from frontend) or needs to be hashed
    const passwordToUse = registerDto.password?.startsWith('$2')
      ? registerDto.password // Already bcrypt hashed (admin registration)
      : await bcrypt.hash(registerDto.password || '', 10); // Hash if not already hashed (admin registration)

    const user = await this.usersService.create({
      ...registerDto,
      password: passwordToUse,
      country: countryEntity.id,
      verified: registerDto.verified ?? false, // Use provided verified status or default to false
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    console.log(
      'Generated JWT token for new user:',
      access_token.substring(0, 20) + '...',
    );

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        suite_no: user.suite_no,
        country: user.country?.name,
        verified: user.verified,
      },
    };
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
        country: user.country?.name,
        verified: user.verified,
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
