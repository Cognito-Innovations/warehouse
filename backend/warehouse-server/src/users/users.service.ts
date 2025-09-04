import { Injectable } from '@nestjs/common';

import { supabase } from '../supabase/supabase.client';

@Injectable()
export class UsersService {
    async createUser(user: { email: string; name?: string; image?: string }) {
      const { data, error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'email' })
        .select('*');

      if (error) throw new Error(error.message);
        return data;
      }

    async getAllUsers() {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw new Error(error.message);
        return data;
    }
}