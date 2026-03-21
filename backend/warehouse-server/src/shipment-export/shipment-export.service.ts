import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExport } from './shipment-export.entity';
import { CreateExportDto } from './dto/create-export.dto';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { Role, User } from 'src/users/user.entity';
import {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_USER_PREFERENCE,
} from 'src/shared/constants';

@Injectable()
export class ShipmentExportsService {
  constructor(
    @InjectRepository(ShipmentExport)
    private readonly exportRepo: Repository<ShipmentExport>,
    @InjectRepository(ShipmentExportBox)
    private readonly boxRepo: Repository<ShipmentExportBox>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async generateExportCode(countryCode: string): Promise<string> {
    const count = await this.exportRepo.count({
      where: {
        country: { code: countryCode },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');

    return `MS/${countryCode}/${sequence}`;
  }

  private async getUserWithRelations(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'preference',
        'preference.courier',
        'preference.courier.country',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private getUserCountryOrFail(user: User) {
    const country = user?.preference?.courier?.country;

    if (user.role === Role.SuperAdmin) {
      return {
        id: DEFAULT_USER_PREFERENCE.COUNTRY,
        code: DEFAULT_COUNTRY_CODE,
      };
    }

    if (!country) {
      throw new BadRequestException('Admin country not configured');
    }

    return country;
  }

  async createExport(
    dto: CreateExportDto,
    userId: string,
  ): Promise<ShipmentExport> {
    try {
      const user = await this.getUserWithRelations(userId);
      const country = this.getUserCountryOrFail(user);

      const exportCode = await this.generateExportCode(country.code);

      const exp = this.exportRepo.create({
        export_code: exportCode,
        boxes_count: dto.boxes_count,
        mawb: dto.mawb,
        created_by: user.id,
        status: 'DRAFT',
        country,
      });
      const savedExport = await this.exportRepo.save(exp);

      if (dto.boxes_count && dto.boxes_count > 0) {
        const boxes: ShipmentExportBox[] = [];
        for (let i = 0; i < dto.boxes_count; i++) {
          const box = this.boxRepo.create({
            length_cm: 0,
            breadth_cm: 0,
            height_cm: 0,
            volumetric_weight: 0,
            mass_weight: 0,
            shipmentExport: savedExport,
          });
          boxes.push(box);
        }
        await this.boxRepo.save(boxes);
      }

      const createdExport = await this.exportRepo.findOne({
        where: { id: savedExport.id },
        relations: ['boxes'],
      });

      if (!createdExport) {
        throw new Error('Unexpected error: created export not found');
      }

      return createdExport;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create export');
    }
  }

  async getAllExports(userId: string): Promise<ShipmentExport[]> {
    try {
      const user = await this.getUserWithRelations(userId);

      if (user.role === Role.SuperAdmin) {
        return this.exportRepo.find({
          relations: ['boxes', 'country'],
          order: { created_at: 'DESC' },
        });
      }

      const country = this.getUserCountryOrFail(user);

      return this.exportRepo.find({
        where: {
          country: { id: country.id },
        },
        relations: ['boxes', 'country'],
        order: { created_at: 'DESC' },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch exports');
    }
  }

  async getExportById(id: string, userId: string): Promise<ShipmentExport> {
    try {
      const user = await this.getUserWithRelations(userId);

      const whereCondition =
        user.role === Role.SuperAdmin
          ? { id }
          : {
              id,
              country: {
                id: this.getUserCountryOrFail(user).id,
              },
            };

      const exp = await this.exportRepo.findOne({
        where: whereCondition,
        relations: ['boxes', 'country'],
      });
      if (!exp) throw new NotFoundException(`Export with id ${id} not found`);
      return exp;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch export');
    }
  }

  async updateExport(
    id: string,
    payload: Partial<{ mawb: string }>,
  ): Promise<ShipmentExport> {
    try {
      const exp = await this.exportRepo.findOne({ where: { id } });
      if (!exp) throw new NotFoundException(`Export with id ${id} not found`);

      Object.assign(exp, payload);
      return this.exportRepo.save(exp);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update export');
    }
  }

  async deleteExport(id: string): Promise<void> {
    try {
      const result = await this.exportRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Export with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete export');
    }
  }

  async markAsDeparted(id: string): Promise<ShipmentExport> {
    try {
      const exp = await this.exportRepo.findOne({
        where: { id },
        relations: ['boxes', 'boxes.shipments'],
      });
      if (!exp) throw new NotFoundException(`Export with id ${id} not found`);

      exp.status = 'SHIPMENTS DEPARTED';
      const saved = await this.exportRepo.save(exp);

      const reloaded = await this.exportRepo.findOne({
        where: { id: saved.id },
        relations: ['boxes', 'boxes.shipments'],
      });
      if (!reloaded)
        throw new NotFoundException(
          `Export with id ${saved.id} not found after update`,
        );

      return reloaded;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Failed to mark status as departed',
      );
    }
  }
}
