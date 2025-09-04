import { Injectable } from '@nestjs/common';

import { dbClient } from '../supabase/supabase.client';

interface Package {
  id?: string;
  customer: string;
  rack_slot: string;
  vendor?: string;
  weight?: string;
  length?: string;
  width?: string;
  height?: string;
  volumetric_weight?: string;
  allow_customer_items?: boolean;
  shop_invoice_received?: boolean;
  remarks?: string;
}

@Injectable()
export class PackagesService {
  async createPackage(pkg: Package) {
    const { data, error } = await dbClient
      .from('packages')
      .insert(pkg)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllPackages() {
    const { data, error } = await dbClient.from('packages').select('*');

    if (error) throw new Error(error.message);
    return data;
  }
}