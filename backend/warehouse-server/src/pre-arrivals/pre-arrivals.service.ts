import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreArrival } from './pre-arrival.entity';
import { CreatePreArrivalDto } from './dto/create-pre-arrival.dto';
import { PreArrivalResponseDto } from './dto/pre-arrival-response.dto';

@Injectable()
export class PreArrivalService {
  constructor(
    @InjectRepository(PreArrival)
    private readonly preArrivalRepository: Repository<PreArrival>,
  ) {}

  async createPrearrival(
    createPreArrivalDto: CreatePreArrivalDto,
  ): Promise<PreArrivalResponseDto> {
    const preArrival = this.preArrivalRepository.create({
      ...createPreArrivalDto,
      status: createPreArrivalDto.status || 'pending',
    });

    const savedPreArrival = await this.preArrivalRepository.save(preArrival);

    return {
      id: savedPreArrival.id,
      customer: savedPreArrival.customer,
      suite: savedPreArrival.suite,
      otp: savedPreArrival.otp,
      tracking_no: savedPreArrival.tracking_no,
      estimate_arrival_time: savedPreArrival.estimate_arrival_time,
      details: savedPreArrival.details,
      status: savedPreArrival.status,
      created_at: savedPreArrival.created_at,
      updated_at: savedPreArrival.updated_at,
    };
  }

  async getAllPrearrival(): Promise<PreArrivalResponseDto[]> {
    const preArrivals = await this.preArrivalRepository.find({
      order: { created_at: 'DESC' },
    });

    return preArrivals.map((preArrival) => ({
      id: preArrival.id,
      customer: preArrival.customer,
      suite: preArrival.suite,
      otp: preArrival.otp,
      tracking_no: preArrival.tracking_no,
      estimate_arrival_time: preArrival.estimate_arrival_time,
      details: preArrival.details,
      status: preArrival.status,
      created_at: preArrival.created_at,
      updated_at: preArrival.updated_at,
    }));
  }

  async getOTPById(id: string): Promise<PreArrivalResponseDto> {
    const preArrival = await this.preArrivalRepository.findOne({
      where: { id },
    });

    if (!preArrival) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }

    return {
      id: preArrival.id,
      customer: preArrival.customer,
      suite: preArrival.suite,
      otp: preArrival.otp,
      tracking_no: preArrival.tracking_no,
      estimate_arrival_time: preArrival.estimate_arrival_time,
      details: preArrival.details,
      status: preArrival.status,
      created_at: preArrival.created_at,
      updated_at: preArrival.updated_at,
    };
  }

  async updateStatusToReceived(id: string): Promise<PreArrivalResponseDto> {
    const preArrival = await this.preArrivalRepository.findOne({
      where: { id },
    });

    if (!preArrival) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }

    if (preArrival.status !== 'pending') {
      throw new BadRequestException(
        'Status must be "pending" to mark as received',
      );
    }

    preArrival.status = 'received';
    const updatedPreArrival = await this.preArrivalRepository.save(preArrival);

    return {
      id: updatedPreArrival.id,
      customer: updatedPreArrival.customer,
      suite: updatedPreArrival.suite,
      otp: updatedPreArrival.otp,
      tracking_no: updatedPreArrival.tracking_no,
      estimate_arrival_time: updatedPreArrival.estimate_arrival_time,
      details: updatedPreArrival.details,
      status: updatedPreArrival.status,
      created_at: updatedPreArrival.created_at,
      updated_at: updatedPreArrival.updated_at,
    };
  }
}
