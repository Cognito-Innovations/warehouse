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
      registerDto.image || '',
      registerDto.email,
      registerDto.name || '',
      registerDto.password || '123456',
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = JSON.parse(atob(token.split('.')[1]));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return payload.sub as string;
      // eslint-disable-next-line
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      throw new Error('Invalid token');
    }
  }
}
