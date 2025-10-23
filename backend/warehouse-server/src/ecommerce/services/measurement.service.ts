import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceMeasurement } from '../entities/measurement.entity.js';
import { CreateEcommerceMeasurementDto } from '../dto/measurement/create-measurement.dto.js';

@Injectable()
export class MeasurementService {
  constructor(
    @InjectRepository(EcommerceMeasurement)
    private readonly measurementRepository: Repository<EcommerceMeasurement>,
  ) {}

  async create(
    createEcommerceMeasurementDto: CreateEcommerceMeasurementDto,
  ): Promise<EcommerceMeasurement> {
    const existingMeasurement = await this.measurementRepository.findOne({
      where: { label: createEcommerceMeasurementDto.label },
    });
    if (existingMeasurement) {
      throw new ConflictException(
        `Measurement with label "${createEcommerceMeasurementDto.label}" already exists`,
      );
    }

    const measurement = this.measurementRepository.create({
      label: createEcommerceMeasurementDto.label,
    });
    return await this.measurementRepository.save(measurement);
  }

  findAll() {
    return this.measurementRepository.find();
  }
}
