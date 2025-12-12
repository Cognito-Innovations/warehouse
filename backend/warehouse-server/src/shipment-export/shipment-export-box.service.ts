import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentExportBox } from './shipment-export-box.entity';
import { ShipmentExport } from './shipment-export.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { Shipment, ShipmentStatus } from 'src/shipments/shipment.entity';
import { User } from 'src/users/user.entity';

export interface TransformedShipment {
  id: string;
  shipment_no: string;
  tracking_no: string;
  status: ShipmentStatus;
  user: User;
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
    const box = await this.boxRepo.findOne({ where: { id: boxId } });
    if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);

    const shipments = await this.shipmentRepo
      .createQueryBuilder('shipment')
      .leftJoin('shipment.user', 'user')
      .leftJoin('shipment.country', 'country')
      .leftJoin('user.preference', 'preference')
      .leftJoin('preference.courier', 'courier')
      .where('shipment.shipment_export_box_id = :boxId', { boxId })
      .select([
        'shipment.id AS id',
        'shipment.shipment_no AS shipment_no',
        'shipment.tracking_no AS tracking_no',
        'shipment.status AS status',
        'shipment.customs_value AS customs_value',
        'shipment.dangerous_good AS dangerous_good',
        'shipment.total_weight AS total_weight',
        'shipment.total_volumetric_weight AS total_volumetric_weight',
        'shipment.length AS length',
        'shipment.width AS width',
        'shipment.height AS height',
        'shipment.created_at AS created_at',
        'shipment.updated_at AS updated_at',
        'NULL AS "shipmentExportBox"',
      ])
      .addSelect(
        `json_build_object(
          'id', country.id,
          'name', country.name
        )`,
        'country',
      )
      .addSelect(
        `json_build_object(
          'id', user.id, 
          'name', user.name,
          'phone_code', user.phone_code,
          'phone_number', user.phone_number,
          'preference', json_build_object(
              'id', preference.id,
              'courier', json_build_object(
                  'id', courier.id,
                  'address', courier.address
              )
          )
      )`,
        'user',
      )
      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(ARRAY_AGG(package_item.name), '{}')")
          .from('packages', 'pkg')
          .leftJoin(
            'package_items',
            'package_item',
            'package_item.package_id = pkg.id',
          )
          .where('pkg.shipment_id = shipment.id');
      }, 'packageItemNames')
      .getRawMany<TransformedShipment>();

    return shipments;
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
