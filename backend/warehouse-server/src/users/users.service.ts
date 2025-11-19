import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      id_card_passport_no: user.id_card_passport_no,
      name: user.name,
      role: user.role,
      suite_no: user.suite_no,
      phone_number: user.phone_number,
      alternate_phone_number: user.alternate_phone_number,
      gender: user.gender,
      dob: user.dob,
      preference: user.preference,
      address: user.address,
      identifier: user.identifier,
      verified: user.verified,
      email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { email: 'ASC' },
    });

    return users.map((user) => this.mapToUserResponseDto(user));
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['preference', 'address'],
    });
  }

  async findBySuiteNo(suiteNo: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { suite_no: suiteNo },
      relations: ['preference', 'address'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['preference', 'address'],
    });
  }

  async findCountryByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { name } });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.userRepository.create({
      ...createUserDto,
    });
    const savedUser = await this.userRepository.save(user);

    return this.mapToUserResponseDto(savedUser);
  }

  async update(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, {
      ...updateUserDto,
    });
    const updatedUser = await this.userRepository.save(user);
    return this.mapToUserResponseDto(updatedUser);
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.findById(id);
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update password', error);
    }
  }

  async sendVerificationOtp(userId: string): Promise<{ message: string }> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    const BRAND_COLOR = '#7C3AED';
    const BRAND_NAME = 'Palakart';

    user.otp = otp;
    user.otp_expires_at = otp_expires_at;
    await this.userRepository.save(user);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${BRAND_COLOR}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Verify Your Email Address</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
          <p>Hello ${user.name || 'User'},</p>
          <p>Thank you for updating your profile. Please use the One-Time Password (OTP) below to verify your email address. This code is valid for <strong>10 minutes</strong>.</p>
          <div style="background-color: #eef4ff; border: 2px dashed ${BRAND_COLOR}; color: ${BRAND_COLOR}; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; margin: 25px 0; letter-spacing: 8px;">
            ${otp}
          </div>
          <p>If you did not request this verification, you can safely ignore this email.</p>
          <p>Thanks,<br>The ${BRAND_NAME} Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #888;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} <span style="color: ${BRAND_COLOR}; font-weight: bold;">${BRAND_NAME}</span>. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Email Verification Code',
      html: htmlContent,
    });

    return { message: 'OTP has been sent to your email.' };
  }

  async verifyEmailOtp(userId: string, otp: string): Promise<UserResponseDto> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (
      user.otp !== otp ||
      !user.otp_expires_at ||
      new Date() > user.otp_expires_at
    ) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    user.email_verified = true;
    user.otp = null;
    user.otp_expires_at = null;

    const updatedUser = await this.userRepository.save(user);

    return this.mapToUserResponseDto(updatedUser);
  }
}
