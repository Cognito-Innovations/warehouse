import { supabase } from '../supabase/supabase.client';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

interface CreatePackageDto {
  customer: string;
  rack_slot: string;
  tracking_no?: string;
  vendor: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  volumetric_weight: string;
  allow_customer_items: boolean;
  shop_invoice_received: boolean;
  remarks: string;
  pieces: Array<{
    weight: string;
    length: string;
    width: string;
    height: string;
    volumetric_weight: string;
  }>;
}


@Injectable()
export class PackagesService {
  async createPackage(createPackageDto: CreatePackageDto) {
    // Generate custom package ID (will be stored in a separate field)
    const customPackageId = await this.generatePackageId();
    
    // First, create the package
    const packageData = {
      customer_id: createPackageDto.customer,
      vendor_id: createPackageDto.vendor,
      tracking_no: createPackageDto.tracking_no,
      rack_slot_id: createPackageDto.rack_slot,
      country: '54e03123-77f4-477f-85d4-083d4701ae39', // Hardcoded default country ID
      total_weight: parseFloat(createPackageDto.weight) || 0,
      total_volumetric_weight: parseFloat(createPackageDto.volumetric_weight) || 0,
      allow_customer_items: createPackageDto.allow_customer_items,
      shop_invoice_received: createPackageDto.shop_invoice_received,
      remarks: createPackageDto.remarks,
      status: 'Action Required',
      dangerous_good: false,
      created_by: 'c051bbaf-b3ab-4d7f-b5cc-6511ce5ea40e', // This should come from auth context
      custom_package_id: customPackageId, // Store custom ID in a separate field
    };

    const { data: packageResult, error: packageError } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
      .single();

    if (packageError) throw new Error(packageError.message);

    // Then, create package measurements for each piece
    if (createPackageDto.pieces && createPackageDto.pieces.length > 0) {
      const measurementsData = createPackageDto.pieces.map((piece, index) => {
        const weight = parseFloat(piece.weight) || 0;
        const volumetricWeight = piece.volumetric_weight ? parseFloat(piece.volumetric_weight) : null;
        const length = piece.length ? parseFloat(piece.length) : null;
        const width = piece.width ? parseFloat(piece.width) : null;
        const height = piece.height ? parseFloat(piece.height) : null;

        // Check if we have valid dimensions (all > 0)
        const hasValidDimensions = length && width && height && 
          length > 0 && width > 0 && height > 0;

        return {
          package_id: packageResult.id,
          piece_number: index + 1,
          weight: weight, // Required
          volumetric_weight: volumetricWeight, // Optional
          length: hasValidDimensions ? length : null, // Optional
          width: hasValidDimensions ? width : null, // Optional
          height: hasValidDimensions ? height : null, // Optional
          has_measurements: hasValidDimensions,
          measurement_verified: false,
        };
      });

      const { error: measurementsError } = await supabase
        .from('package_measurements')
        .insert(measurementsData);

      if (measurementsError) {
        console.error('Failed to create package measurements:', measurementsError);
        throw new Error(`Package created but failed to save measurements: ${measurementsError.message}`);
      }
    }

    return packageResult;
  }

  async getAllPackages() {
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        customer:users!packages_customer_id_fkey(*),
        creator:users!packages_created_by_fkey(*),
        rack_slot:racks!packages_rack_slot_id_fkey(id, label, color, count),
        vendor:suppliers!packages_vendor_id_fkey(id, supplier_name, country, contact_number, postal_code, address, website),
        items:package_items(*),
        measurements:package_measurements(*),
        charges:package_charges(*),
        documents:package_documents(*),
        action_logs:package_action_logs(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getPackageById(id: string) {
    // Check if the input is a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase
      .from('packages')
      .select(`
        *,
        customer:users!packages_customer_id_fkey(*),
        creator:users!packages_created_by_fkey(*),
        rack_slot:racks!packages_rack_slot_id_fkey(id, label, color, count),
        vendor:suppliers!packages_vendor_id_fkey(id, supplier_name, country, contact_number, postal_code, address, website),
        items:package_items(*),
        measurements:package_measurements(*),
        charges:package_charges(*),
        documents:package_documents(*),
        action_logs:package_action_logs(*)
      `);

    if (isUUID) {
      // Search by UUID
      query = query.eq('id', id);
    } else {
      // Search by custom package ID
      query = query.eq('custom_package_id', id);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Package with id ${id} not found`);
      }
      throw new Error(error.message);
    }
    return data;
  }

  async updatePackageStatus(id: string, status: string, updated_by: string) {
    // First check if package exists
    const existingPackage = await this.getPackageById(id);
    if (!existingPackage) {
      throw new NotFoundException(`Package with id ${id} not found`);
    }

    // Check if the input is a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    
    let query = supabase
      .from('packages')
      .update({ 
        status, 
        updated_by,
        updated_at: new Date().toISOString(),
      });

    if (isUUID) {
      // Update by UUID
      query = query.eq('id', id);
    } else {
      // Update by custom package ID
      query = query.eq('custom_package_id', id);
    }

    const { data, error } = await query.select().single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  private async generatePackageId(): Promise<string> {
    const prefix = 'PKG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const packageId = `${prefix}${timestamp}${random}`;
    
    // Check if this custom ID already exists
    const { data: existingPackage } = await supabase
      .from('packages')
      .select('custom_package_id')
      .eq('custom_package_id', packageId)
      .single();
    
    // If ID exists, generate a new one recursively
    if (existingPackage) {
      return this.generatePackageId();
    }
    
    return packageId;
  }

  private generateTrackingNumber(): string {
    const prefix = 'PKG';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}