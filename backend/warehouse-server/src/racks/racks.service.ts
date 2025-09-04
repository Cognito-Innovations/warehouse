import { Injectable } from '@nestjs/common';

import { dbClient } from '../supabase/supabase.client';

interface Rack {
  id?: string;
  label: string;
  color: string;
  count?: number;
}

@Injectable()
export class RacksService {
  async createRack(rack: Rack) {
    const { data, error } = await dbClient
      .from('racks')
      .insert(rack)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllRacks() {
    const { data, error } = await dbClient.from('racks').select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  async updateRack(id: string, rack: Partial<Rack>) {
    const { data, error } = await dbClient
      .from('racks')
      .update(rack)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  }

  async deleteRack(id: string) {
    const { error } = await dbClient.from('racks').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return { success: true };
  }
}