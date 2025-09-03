import { Injectable } from '@nestjs/common';

import { supabase } from '../supabase/supabase.client';

interface Supplier {
  id?: string;
  country: string;
  supplier_name: string;
  contact_number?: string;
  postal_code?: string;
  address?: string;
  website?: string;
}

@Injectable()
export class SuppliersService {
  async createSupplier(supplier: Supplier) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplier)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllSuppliers() {
    const { data, error } = await supabase.from('suppliers').select('*');

    if (error) throw new Error(error.message);
    return data;
  }
}