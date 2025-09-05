import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class ProductsService {
  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('shopping_request_products')
      .insert(product)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateUnitPrice(id: string, unitPrice: number) {
    const { data, error } = await supabase
      .from('shopping_request_products')
      .update({ unit_price: unitPrice })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}