import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './service/auth.service';
import { User } from 'src/users/user.entity';

import { JwtStrategy } from './strategies/jwt.strategy';
import { GlobalAuthGuard } from './guards/global-auth.guard';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '24h',
        issuer: 'warehouse-app',
        audience: 'warehouse-users',
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, GlobalAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, GlobalAuthGuard],
})
export class AuthModule {}