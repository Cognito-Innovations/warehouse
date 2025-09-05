import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingRequest } from './shopping-request.entity';
import { CreateShoppingRequestDto } from './dto/create-shopping-request.dto';
import { ShoppingRequestResponseDto } from './dto/shopping-request-response.dto';

@Injectable()
export class ShoppingRequestsService {
  constructor(
    @InjectRepository(ShoppingRequest)
    private readonly shoppingRequestRepository: Repository<ShoppingRequest>,
  ) {}

  async createShoppingRequest(
    createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = this.shoppingRequestRepository.create({
      ...createShoppingRequestDto,
      status: createShoppingRequestDto.status || 'REQUESTED',
      items: createShoppingRequestDto.items || 0,
    });

    const savedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);

    return {
      id: savedShoppingRequest.id,
      user_id: savedShoppingRequest.user_id,
      request_code: savedShoppingRequest.request_code,
      country: savedShoppingRequest.country,
      items: savedShoppingRequest.items,
      remarks: savedShoppingRequest.remarks,
      status: savedShoppingRequest.status,
      payment_slips: savedShoppingRequest.payment_slips,
      created_at: savedShoppingRequest.created_at,
      updated_at: savedShoppingRequest.updated_at,
    };
  }

  async getAllShoppingRequests(): Promise<ShoppingRequestResponseDto[]> {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      order: { created_at: 'DESC' },
    });

    return shoppingRequests.map((request) => ({
      id: request.id,
      user_id: request.user_id,
      request_code: request.request_code,
      country: request.country,
      items: request.items,
      remarks: request.remarks,
      status: request.status,
      payment_slips: request.payment_slips,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  }

  async getShoppingRequestsByUser(
    userId: string,
  ): Promise<ShoppingRequestResponseDto[]> {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return shoppingRequests.map((request) => ({
      id: request.id,
      user_id: request.user_id,
      request_code: request.request_code,
      country: request.country,
      items: request.items,
      remarks: request.remarks,
      status: request.status,
      payment_slips: request.payment_slips,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  }

  async getShoppingRequestByCode(
    requestCode: string,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { request_code: requestCode },
    });

    if (!shoppingRequest) {
      throw new NotFoundException(
        `Shopping request with code ${requestCode} not found`,
      );
    }

    return {
      id: shoppingRequest.id,
      user_id: shoppingRequest.user_id,
      request_code: shoppingRequest.request_code,
      country: shoppingRequest.country,
      items: shoppingRequest.items,
      remarks: shoppingRequest.remarks,
      status: shoppingRequest.status,
      payment_slips: shoppingRequest.payment_slips,
      created_at: shoppingRequest.created_at,
      updated_at: shoppingRequest.updated_at,
    };
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { id },
    });

    if (!shoppingRequest) {
      throw new NotFoundException(`Shopping request with id ${id} not found`);
    }

    shoppingRequest.status = status;
    const updatedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);

    return {
      id: updatedShoppingRequest.id,
      user_id: updatedShoppingRequest.user_id,
      request_code: updatedShoppingRequest.request_code,
      country: updatedShoppingRequest.country,
      items: updatedShoppingRequest.items,
      remarks: updatedShoppingRequest.remarks,
      status: updatedShoppingRequest.status,
      payment_slips: updatedShoppingRequest.payment_slips,
      created_at: updatedShoppingRequest.created_at,
      updated_at: updatedShoppingRequest.updated_at,
    };
  }

  async addPaymentSlip(
    id: string,
    url: string,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { id },
    });

    if (!shoppingRequest) {
      throw new NotFoundException(`Shopping request with id ${id} not found`);
    }

    const newSlips = shoppingRequest.payment_slips
      ? [...shoppingRequest.payment_slips, url]
      : [url];

    shoppingRequest.payment_slips = newSlips;
    const updatedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);

    return {
      id: updatedShoppingRequest.id,
      user_id: updatedShoppingRequest.user_id,
      request_code: updatedShoppingRequest.request_code,
      country: updatedShoppingRequest.country,
      items: updatedShoppingRequest.items,
      remarks: updatedShoppingRequest.remarks,
      status: updatedShoppingRequest.status,
      payment_slips: updatedShoppingRequest.payment_slips,
      created_at: updatedShoppingRequest.created_at,
      updated_at: updatedShoppingRequest.updated_at,
    };
  }
}
