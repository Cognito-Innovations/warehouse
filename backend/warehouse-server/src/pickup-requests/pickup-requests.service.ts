import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface PickupRequest {
  id?: string;
  user_id: string;
  pickup_address: string;
  supplier_name: string;
  supplier_phone: string;
  alt_phone?: string;
  pcs_box: number;
  est_weight?: number;
  pkg_details: string;
  remarks?: string;
  status?: string;
}

@Injectable()
export class PickupRequestsService {
  async createPickupRequest(req: PickupRequest) {
    const newReq = {
      ...req,
      status: req.status || 'REQUESTED',
    };

    const { data, error } = await supabase
      .from('pickup_requests')
      .insert(newReq)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllPickupRequests() {
    const { data, error } = await supabase
      .from('pickup_requests')
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

  async getPickupRequestsByUser(userId: string) {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
  }

  async getPickupRequestById(id: string) {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select(`
        *,
        users (
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateStatus(id: string, status: string, price?: number) {
    const updateData: any = { status };

    if (price !== undefined) {
      updateData.price = price;
    }

    const now = new Date().toISOString();
    switch (status.toUpperCase()) {
      case 'QUOTED':
        updateData.quoted_at = now;
        break;
      case 'CONFIRMED':
        updateData.confirmed_at = now;
        break;
      case 'PICKED':
        updateData.picked_at = now;
        break;
    }

    const { data, error } = await supabase
      .from('pickup_requests')
      .update(updateData)
      .eq('id', id)
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
}