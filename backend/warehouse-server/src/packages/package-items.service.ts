import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface CreatePackageItemDto {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface UpdatePackageItemDto {
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

@Injectable()
export class PackageItemsService {
  async createItem(packageId: string, createItemDto: CreatePackageItemDto) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const itemData = {
      package_id: packageData.id,
      name: createItemDto.name,
      quantity: createItemDto.quantity,
      unit_price: createItemDto.unit_price,
      total_price: createItemDto.total_price,
    };

    const { data, error } = await supabase
      .from('package_items')
      .insert(itemData)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create item: ${error.message}`);
    }

    return data;
  }

  async updateItem(packageId: string, itemId: string, updateItemDto: UpdatePackageItemDto) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const { data, error } = await supabase
      .from('package_items')
      .update({
        name: updateItemDto.name,
        quantity: updateItemDto.quantity,
        unit_price: updateItemDto.unit_price,
        total_price: updateItemDto.total_price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('package_id', packageData.id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to update item: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    return data;
  }

  async deleteItem(packageId: string, itemId: string) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const { error } = await supabase
      .from('package_items')
      .delete()
      .eq('id', itemId)
      .eq('package_id', packageData.id);

    if (error) {
      throw new BadRequestException(`Failed to delete item: ${error.message}`);
    }

    return { success: true };
  }

  async bulkUpload(packageId: string, items: CreatePackageItemDto[]) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const itemsData = items.map(item => ({
      package_id: packageData.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { data, error } = await supabase
      .from('package_items')
      .insert(itemsData)
      .select();

    if (error) {
      throw new BadRequestException(`Failed to bulk upload items: ${error.message}`);
    }

    return { items: data };
  }

  async getItems(packageId: string) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const { data, error } = await supabase
      .from('package_items')
      .select('*')
      .eq('package_id', packageData.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to get items: ${error.message}`);
    }

    return data;
  }
}
