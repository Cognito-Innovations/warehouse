import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface ShoppingRequest {
  id?: string;
  user_id: string;
  request_code: string;
  country: string;
  items: number;
  items_data: any;
  remarks?: string;
  status?: string;
}

@Injectable()
export class ShoppingRequestsService {
  async createShoppingRequest(req: ShoppingRequest) {
    const newReq = {
      ...req,
      status: req.status || 'REQUESTED',
    };

    const { data, error } = await supabase
      .from('shopping_requests')
      .insert(newReq)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllShoppingRequests() {
    const { data, error } = await supabase
      .from('shopping_requests')
      .select(`
        *,
        users (
          name,
          email
        )
      `);

    if (error) throw new Error(error.message);
    return data;
  }

  async getShoppingRequestsByUser(userId: string) {
    const { data, error } = await supabase
      .from('shopping_requests')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
  }

  async getShoppingRequestByCode(requestCode: string) {
    const { data, error } = await supabase
      .from('shopping_requests')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .eq('request_code', requestCode)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}