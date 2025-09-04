import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface ShoppingRequest {
  id?: string;
  user_id: string;
  request_code: string;
  country: string;
  items?: number;
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
        ),
        shopping_request_products ( * )
      `)
      .eq('request_code', requestCode)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('shopping_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async addPaymentSlip(id: string, url: string) {
    const { data: existing, error: fetchError } = await supabase
      .from('shopping_requests')
      .select('payment_slips')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const newSlips = existing?.payment_slips
      ? [...existing.payment_slips, url]
      : [url];

    const { data, error } = await supabase
      .from('shopping_requests')
      .update({ payment_slips: newSlips })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}