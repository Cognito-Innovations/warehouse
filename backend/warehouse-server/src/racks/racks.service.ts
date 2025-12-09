import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Rack } from './rack.entity';
import { CreateRackDto } from './dto/create-rack.dto';
import { RackResponseDto } from './dto/rack-response.dto';

@Injectable()
export class RacksService {
  constructor(
    @InjectRepository(Rack)
    private readonly rackRepository: Repository<Rack>,
  ) {}

  async createRack(createRackDto: CreateRackDto): Promise<RackResponseDto> {
    const existingRack = await this.rackRepository.findOne({
      where: { label: createRackDto.label },
    });
    if (existingRack) {
      throw new ConflictException(
        `Rack with label "${createRackDto.label}" already exists`,
      );
    }

    const rack = this.rackRepository.create({
      label: createRackDto.label,
      color: createRackDto.color,
      count: createRackDto.count,
    });

    const savedRack = await this.rackRepository.save(rack);

    return savedRack as RackResponseDto;
  }

  async getAllRacks(): Promise<RackResponseDto[]> {
    const racks = await this.rackRepository.find({
      order: { label: 'ASC' },
    });

    return plainToInstance(RackResponseDto, racks, {
      excludeExtraneousValues: true,
    });
  }

  async updateRack(
    id: string,
    updateData: Partial<CreateRackDto>,
  ): Promise<RackResponseDto> {
    await this.rackRepository.update(id, updateData);
    const updatedRack = await this.rackRepository.findOne({ where: { id } });

    if (!updatedRack) {
      throw new Error('Rack not found');
    }

    return updatedRack as RackResponseDto;
  }

  async deleteRack(id: string): Promise<{ success: boolean }> {
    try {
      const result = await this.rackRepository.delete(id);

      if (result.affected === 0) {
        throw new Error('Rack not found');
      }

      return { success: true };
    } catch (err) {
      if (err instanceof QueryFailedError) {
        const driverError = (
          err as QueryFailedError & { driverError?: { code?: string } }
        ).driverError;
        if (driverError?.code === '23503') {
          throw new ConflictException(
            'This rack slot is added to a package and cannot be deleted.',
          );
        }
      }
      throw err;
    }
  }
}
