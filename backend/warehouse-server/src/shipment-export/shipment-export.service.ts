import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExport } from './shipment-export.entity';
import { CreateExportDto } from './dto/create-export.dto';
import { ShipmentExportBox } from './shipment-export-box.entity';

@Injectable()
export class ShipmentExportsService {
  constructor(
    @InjectRepository(ShipmentExport)
    private readonly exportRepo: Repository<ShipmentExport>,
    @InjectRepository(ShipmentExportBox)
    private readonly boxRepo: Repository<ShipmentExportBox>,
  ) {}

  async createExport(dto: CreateExportDto): Promise<any> {
    const exp = this.exportRepo.create({
      ...dto,
      status: 'DRAFT',
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

    return this.exportRepo.findOne({
      where: { id: savedExport.id },
      relations: ['boxes'],
    });
  }

  async getAllExports(): Promise<ShipmentExport[]> {
    return this.exportRepo.find({ relations: ['boxes'], order: { created_at: 'DESC' } });
  }

  async getExportById(id: string): Promise<ShipmentExport> {
    const exp = await this.exportRepo.findOne({ where: { id }, relations: ['boxes'] })
    if (!exp) throw new NotFoundException(`Export with id ${id} not found`);
    return exp;
  }

  async updateExport(id: string, payload: Partial<{ mawb: string }>): Promise<ShipmentExport> {
    const exp = await this.exportRepo.findOne({ where: { id } });
    if (!exp) throw new NotFoundException(`Export with id ${id} not found`);

    Object.assign(exp, payload);
    return this.exportRepo.save(exp);
  }

  async deleteExport(id: string): Promise<void> {
    const result = await this.exportRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Export with id ${id} not found`);
    }
  }
}