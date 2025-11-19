import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreArrival } from './pre-arrival.entity';
import { User } from 'src/users/user.entity';
import { CreatePreArrivalDto } from './dto/create-pre-arrival.dto';
import { PreArrivalResponseDto } from './dto/pre-arrival-response.dto';

@Injectable()
export class PreArrivalService {
  constructor(
    @InjectRepository(PreArrival)
    private readonly preArrivalRepository: Repository<PreArrival>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private mapToResponseDto(preArrival: PreArrival): PreArrivalResponseDto {
    const { user, ...rest } = preArrival;

    if (!user) {
      throw new InternalServerErrorException(
        `User data not loaded for PreArrival ID: ${preArrival.id}`,
      );
    }

    return {
      ...rest,
      user: user.name,
      suite: user.suite_no,
    };
  }

  async createPrearrival(
    createPreArrivalDto: CreatePreArrivalDto,
  ): Promise<PreArrivalResponseDto> {
    const { userId, ...restOfDto } = createPreArrivalDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const preArrival = this.preArrivalRepository.create({
      ...restOfDto,
      user,
      status: createPreArrivalDto.status || 'pending',
    });

    const savedPreArrival = await this.preArrivalRepository.save(preArrival);
    savedPreArrival.user = user; 

    return this.mapToResponseDto(savedPreArrival);
  }

  async getAllPrearrival(): Promise<PreArrivalResponseDto[]> {
    const preArrivals = await this.preArrivalRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return preArrivals.map((preArrival) => this.mapToResponseDto(preArrival));
  }

  async getPreArrivalById(id: string): Promise<PreArrivalResponseDto> {
    const preArrival = await this.preArrivalRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!preArrival) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }

    return this.mapToResponseDto(preArrival);
  }

  async updateStatusToReceived(id: string): Promise<PreArrivalResponseDto> {
    const preArrival = await this.preArrivalRepository.findOne({
      where: { id },
      relations: ['user'],
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

    return this.mapToResponseDto(updatedPreArrival);
  }

  async getPreArrivalsByUser(userId: string): Promise<PreArrivalResponseDto[]> {
    const preArrivals = await this.preArrivalRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return preArrivals.map((preArrival) => this.mapToResponseDto(preArrival));
  }

  async deletePreArrival(id: string): Promise<void> {
    const preArrival = await this.preArrivalRepository.findOne({
      where: { id },
    });
    if (!preArrival) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }
    await this.preArrivalRepository.remove(preArrival);
  }
}
