import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { ShipmentExport } from './shipment-export.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { Shipment } from 'src/shipments/shipment.entity';

@Injectable()
export class ShipmentExportBoxesService {
  constructor(
    @InjectRepository(ShipmentExportBox)
    private readonly boxRepo: Repository<ShipmentExportBox>,
    @InjectRepository(ShipmentExport)
    private readonly exportRepo: Repository<ShipmentExport>,
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
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

  async getShipmentsByBoxId(boxId: string): Promise<Shipment[]> {
    const box = await this.boxRepo.findOne({
      where: { id: boxId },
      relations: ['shipments'],
    });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);
    return box.shipments;
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
