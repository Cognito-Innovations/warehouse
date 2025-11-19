import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommerceMeasurement } from '../entities/measurement.entity.js';
import { EcommerceCargoOption } from '../entities/cargo-options.entity.js';
import { CreateEcommerceCargoOptionDto } from '../dto/cargo_option/create-cargo-option.dto.js';

@Injectable()
export class CargoOptionsService {
  constructor(
    @InjectRepository(EcommerceCargoOption)
    private readonly cargoOptionRepository: Repository<EcommerceCargoOption>,
  ) {}

  async create(
    createEcommerceCargoOptionDto: CreateEcommerceCargoOptionDto,
  ): Promise<EcommerceMeasurement> {
    const existingCargoOption = await this.cargoOptionRepository.findOne({
      where: { label: createEcommerceCargoOptionDto.label },
    });
    if (existingCargoOption) {
      throw new ConflictException(
        `Cargo Option with label "${createEcommerceCargoOptionDto.label}" already exists`,
      );
    }

    const cargoOption = this.cargoOptionRepository.create({
      label: createEcommerceCargoOptionDto.label,
    });
    return await this.cargoOptionRepository.save(cargoOption);
  }

  findAll() {
    return this.cargoOptionRepository.find();
  }
}
