import { Injectable } from '@nestjs/common';

import { supabase } from '../supabase/supabase.client';

interface Rack {
  id?: string;
  label: string;
  color: string;
  count?: number;
}

@Injectable()
export class RacksService {
  async createRack(rack: Rack) {
    const { data, error } = await supabase
      .from('racks')
      .insert(rack)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllRacks() {
    const { data, error } = await supabase.from('racks').select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  async updateRack(id: string, rack: Partial<Rack>) {
    const { data, error } = await supabase
      .from('racks')
      .update(rack)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  async deleteRack(id: string) {
    const { error } = await supabase.from('racks').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
}