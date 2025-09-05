import { Injectable } from '@nestjs/common';
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

  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<SupplierResponseDto> {
    const supplier = this.supplierRepository.create({
      country: createSupplierDto.country,
      supplier_name: createSupplierDto.supplier_name,
    });

    const savedSupplier = await this.supplierRepository.save(supplier);
    
    return {
      id: savedSupplier.id,
      country: savedSupplier.country,
      supplier_name: savedSupplier.supplier_name,
      created_at: savedSupplier.created_at,
      updated_at: savedSupplier.updated_at,
    };
  }

  async getAllSuppliers(): Promise<SupplierResponseDto[]> {
    const suppliers = await this.supplierRepository.find({
      order: { supplier_name: 'ASC' },
    });
    
    return suppliers.map(supplier => ({
      id: supplier.id,
      country: supplier.country,
      supplier_name: supplier.supplier_name,
      created_at: supplier.created_at,
      updated_at: supplier.updated_at,
    }));
  }
}