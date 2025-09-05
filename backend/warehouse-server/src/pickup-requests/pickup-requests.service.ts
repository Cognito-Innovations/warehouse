import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PickupRequest } from './pickup-request.entity';
import { CreatePickupRequestDto } from './dto/create-pickup-request.dto';
import { PickupRequestResponseDto } from './dto/pickup-request-response.dto';

@Injectable()
export class PickupRequestsService {
  constructor(
    @InjectRepository(PickupRequest)
    private readonly pickupRequestRepository: Repository<PickupRequest>,
  ) {}

  async createPickupRequest(
    createPickupRequestDto: CreatePickupRequestDto,
  ): Promise<PickupRequestResponseDto> {
    const pickupRequest = this.pickupRequestRepository.create({
      ...createPickupRequestDto,
      status: createPickupRequestDto.status || 'REQUESTED',
    });

    const savedPickupRequest =
      await this.pickupRequestRepository.save(pickupRequest);

    return {
      id: savedPickupRequest.id,
      user_id: savedPickupRequest.user_id,
      pickup_address: savedPickupRequest.pickup_address,
      supplier_name: savedPickupRequest.supplier_name,
      supplier_phone: savedPickupRequest.supplier_phone,
      alt_phone: savedPickupRequest.alt_phone,
      pcs_box: savedPickupRequest.pcs_box,
      est_weight: savedPickupRequest.est_weight,
      pkg_details: savedPickupRequest.pkg_details,
      remarks: savedPickupRequest.remarks,
      status: savedPickupRequest.status,
      price: savedPickupRequest.price,
      quoted_at: savedPickupRequest.quoted_at,
      confirmed_at: savedPickupRequest.confirmed_at,
      picked_at: savedPickupRequest.picked_at,
      created_at: savedPickupRequest.created_at,
      updated_at: savedPickupRequest.updated_at,
    };
  }

  async getAllPickupRequests(): Promise<PickupRequestResponseDto[]> {
    const pickupRequests = await this.pickupRequestRepository.find({
      order: { created_at: 'DESC' },
    });

    return pickupRequests.map((request) => ({
      id: request.id,
      user_id: request.user_id,
      pickup_address: request.pickup_address,
      supplier_name: request.supplier_name,
      supplier_phone: request.supplier_phone,
      alt_phone: request.alt_phone,
      pcs_box: request.pcs_box,
      est_weight: request.est_weight,
      pkg_details: request.pkg_details,
      remarks: request.remarks,
      status: request.status,
      price: request.price,
      quoted_at: request.quoted_at,
      confirmed_at: request.confirmed_at,
      picked_at: request.picked_at,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  }

  async getPickupRequestsByUser(
    userId: string,
  ): Promise<PickupRequestResponseDto[]> {
    const pickupRequests = await this.pickupRequestRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return pickupRequests.map((request) => ({
      id: request.id,
      user_id: request.user_id,
      pickup_address: request.pickup_address,
      supplier_name: request.supplier_name,
      supplier_phone: request.supplier_phone,
      alt_phone: request.alt_phone,
      pcs_box: request.pcs_box,
      est_weight: request.est_weight,
      pkg_details: request.pkg_details,
      remarks: request.remarks,
      status: request.status,
      price: request.price,
      quoted_at: request.quoted_at,
      confirmed_at: request.confirmed_at,
      picked_at: request.picked_at,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
  }

  async getPickupRequestById(id: string): Promise<PickupRequestResponseDto> {
    const pickupRequest = await this.pickupRequestRepository.findOne({
      where: { id },
    });

    if (!pickupRequest) {
      throw new Error(`Pickup request with id ${id} not found`);
    }

    return {
      id: pickupRequest.id,
      user_id: pickupRequest.user_id,
      pickup_address: pickupRequest.pickup_address,
      supplier_name: pickupRequest.supplier_name,
      supplier_phone: pickupRequest.supplier_phone,
      alt_phone: pickupRequest.alt_phone,
      pcs_box: pickupRequest.pcs_box,
      est_weight: pickupRequest.est_weight,
      pkg_details: pickupRequest.pkg_details,
      remarks: pickupRequest.remarks,
      status: pickupRequest.status,
      price: pickupRequest.price,
      quoted_at: pickupRequest.quoted_at,
      confirmed_at: pickupRequest.confirmed_at,
      picked_at: pickupRequest.picked_at,
      created_at: pickupRequest.created_at,
      updated_at: pickupRequest.updated_at,
    };
  }

  async updateStatus(
    id: string,
    status: string,
    price?: number,
  ): Promise<PickupRequestResponseDto> {
    const pickupRequest = await this.pickupRequestRepository.findOne({
      where: { id },
    });

    if (!pickupRequest) {
      throw new Error(`Pickup request with id ${id} not found`);
    }

    pickupRequest.status = status;

    if (price !== undefined) {
      pickupRequest.price = price;
    }

    const now = new Date();
    switch (status.toUpperCase()) {
      case 'QUOTED':
        pickupRequest.quoted_at = now;
        break;
      case 'CONFIRMED':
        pickupRequest.confirmed_at = now;
        break;
      case 'PICKED':
        pickupRequest.picked_at = now;
        break;
    }

    const updatedPickupRequest =
      await this.pickupRequestRepository.save(pickupRequest);

    return {
      id: updatedPickupRequest.id,
      user_id: updatedPickupRequest.user_id,
      pickup_address: updatedPickupRequest.pickup_address,
      supplier_name: updatedPickupRequest.supplier_name,
      supplier_phone: updatedPickupRequest.supplier_phone,
      alt_phone: updatedPickupRequest.alt_phone,
      pcs_box: updatedPickupRequest.pcs_box,
      est_weight: updatedPickupRequest.est_weight,
      pkg_details: updatedPickupRequest.pkg_details,
      remarks: updatedPickupRequest.remarks,
      status: updatedPickupRequest.status,
      price: updatedPickupRequest.price,
      quoted_at: updatedPickupRequest.quoted_at,
      confirmed_at: updatedPickupRequest.confirmed_at,
      picked_at: updatedPickupRequest.picked_at,
      created_at: updatedPickupRequest.created_at,
      updated_at: updatedPickupRequest.updated_at,
    };
  }
}
