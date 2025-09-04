import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface PreArrival {
  id?: string;
  customer: string;
  suite: string;
  otp: number;
  tracking_no: string;
  estimate_arrival_time: string;
  details?: string;
  status: "pending" | "received"
}

@Injectable()
export class PreArrivalService {
  async createPrearrival(preArrival: PreArrival) {
    const { data, error } = await supabase
      .from('pre_arrival')
      .insert(preArrival)
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  async getAllPrearrival() {
    const { data, error } = await supabase.from('pre_arrival').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getOTPById(id: string) {
    const all = await this.getAllPrearrival();
    const item = Array.isArray(all) ? all.find((p: any) => p.id === id) : null;
    if (!item) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }
    return item;
  }

  async updateStatusToReceived(id: string) {
    const all = await this.getAllPrearrival();
    const item = Array.isArray(all) ? all.find((p: any) => p.id === id) : null;
    if (!item) {
      throw new NotFoundException(`Pre-arrival with id ${id} not found`);
    }

    if (item.status !== 'pending') {
      throw new BadRequestException('Status must be "pending" to mark as received');
    }

    // Persist the status update in Supabase and return the updated row.
    const { data, error } = await supabase
      .from('pre_arrival')
      .update({ status: 'received' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }
}