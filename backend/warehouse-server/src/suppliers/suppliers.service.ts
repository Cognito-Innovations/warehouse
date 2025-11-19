import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { supplier_name: createSupplierDto.supplier_name },
    });
    if (existingSupplier) {
      throw new ConflictException(
        `Supplier "${createSupplierDto.supplier_name}" already exists`,
      );
    }

    const supplier = this.supplierRepository.create({
      ...createSupplierDto,
      country: { id: createSupplierDto.country },
    });

    const savedSupplier = await this.supplierRepository.save(supplier);

    return {
      id: savedSupplier.id,
      country: savedSupplier.country,
      supplier_name: savedSupplier.supplier_name,
      created_at: savedSupplier.created_at,
    };
  }

  async getAllSuppliers(): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.find({
      order: { supplier_name: 'ASC' },
    });

    return suppliers.map((supplier) => ({
      id: supplier.id,
      country: supplier.country,
      supplier_name: supplier.supplier_name,
      created_at: supplier.created_at,
    }));
  }
}
