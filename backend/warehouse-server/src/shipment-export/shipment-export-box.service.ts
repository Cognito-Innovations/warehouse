import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { ShipmentExport } from './shipment-export.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { Shipment, ShipmentStatus } from 'src/shipments/shipment.entity';
import { Package, PackageItem } from 'src/packages/entities';
import { UsersService } from 'src/users/users.service';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export interface TransformedShipment {
  id: string;
  shipment_no: string;
  tracking_no: string;
  status: ShipmentStatus;
  user: UserResponseDto;
  shipmentExportBox: ShipmentExportBox | null;
  customs_value: number | null;
  dangerous_good: boolean;
  total_weight: number | null;
  total_volumetric_weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  created_at: number;
  updated_at: number;
  packageItemNames: string[];
}

@Injectable()
export class ShipmentExportBoxesService {
  constructor(
    @InjectRepository(ShipmentExportBox)
    private readonly boxRepo: Repository<ShipmentExportBox>,
    @InjectRepository(ShipmentExport)
    private readonly exportRepo: Repository<ShipmentExport>,
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
    private readonly usersService: UsersService,
  ) {}

  async createBox(
    exportId: string,
    dto: CreateBoxDto,
  ): Promise<ShipmentExportBox> {
    const exp = await this.exportRepo.findOne({ where: { id: exportId } });
    if (!exp)
      throw new NotFoundException(`Export with id ${exportId} not found`);

    const box = this.boxRepo.create({
      ...dto,
      shipmentExport: exp,
    });

    return this.boxRepo.save(box);
  }

  async updateBox(
    id: string,
    dto: Partial<CreateBoxDto>,
  ): Promise<ShipmentExportBox> {
    const box = await this.boxRepo.findOne({ where: { id } });
    if (!box) throw new NotFoundException(`Box with id ${id} not found`);

    Object.assign(box, dto);
    return this.boxRepo.save(box);
  }

  async deleteBox(id: string): Promise<void> {
    const result = await this.boxRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Box with id ${id} not found`);
    }
  }

  async getShipmentsByBoxId(boxId: string): Promise<TransformedShipment[]> {
    const box = await this.boxRepo.findOne({
      where: { id: boxId },
      relations: [
        'shipments',
        'shipments.user.preference',
        'shipments.packages.items',
      ],
    });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);

    const transformedShipments = box.shipments.map((shipment: Shipment) => {
      const packageItemNames: string[] =
        shipment.packages?.flatMap(
          (pkg: Package) =>
            pkg.items?.map((item: PackageItem) => item.name) || [],
        ) || [];

      const transformedUser = this.usersService.mapToUserResponseDto(
        shipment.user,
      );

      const { packages, user, ...rest } = shipment;

      return {
        ...rest,
        user: transformedUser,
        packageItemNames,
      };
    });

    return transformedShipments;
  }

  async addShipmentToBox(boxId: string, shipmentId: string): Promise<Shipment> {
    const box = await this.boxRepo.findOne({ where: { id: boxId } });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);

    const shipment = await this.shipmentRepo.findOne({
      where: { id: shipmentId },
    });
    if (!shipment)
      throw new NotFoundException(`Shipment with id ${shipment} not found`);

    shipment.shipmentExportBox = box;
    return this.shipmentRepo.save(shipment);
  }

  async removeShipmentFromBox(shipmentId: string): Promise<Shipment> {
    const shipment = await this.shipmentRepo.findOne({
      where: { id: shipmentId },
    });
    if (!shipment)
      throw new NotFoundException(`Shipment with id ${shipmentId} not found`);

    shipment.shipmentExportBox = null;
    return this.shipmentRepo.save(shipment);
  }
}
