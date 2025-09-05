import { Controller, Post, Get, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  ValidateResponseDto,
  UserDto,
} from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.country,
    );
  }

  @Post('logout')
  async logout(
    @Headers('authorization') authHeader: string,
  ): Promise<{ message: string }> {
    const userId = this.extractUserIdFromToken(authHeader);
    return this.authService.logout(userId);
  }

  @Post('refresh')
  async refreshToken(
    @Headers('authorization') authHeader: string,
  ): Promise<RefreshTokenResponseDto> {
    const userId = this.extractUserIdFromToken(authHeader);
    return this.authService.refreshToken(userId);
  }

  @Get('profile')
  async getProfile(
    @Headers('authorization') authHeader: string,
  ): Promise<UserDto | null> {
    const userId = this.extractUserIdFromToken(authHeader);
    return this.authService.validateUser(userId);
  }

  @Get('validate')
  async validate(
    @Headers('authorization') authHeader: string,
  ): Promise<ValidateResponseDto> {
    const userId = this.extractUserIdFromToken(authHeader);
    const user = await this.authService.validateUser(userId);

    return {
      valid: !!user,
      user: user || undefined,
    };
  }

  private extractUserIdFromToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    const token = authHeader.substring(7);
    // Simple JWT decode without verification (for demo purposes)
    // In production, you should verify the token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
