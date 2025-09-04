import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

interface CreateActionLogDto {
  package_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
}

@Injectable()
export class PackageActionLogsService {
  async createActionLog(createActionLogDto: CreateActionLogDto) {
    const { data, error } = await supabase
      .from('package_action_logs')
      .insert(createActionLogDto)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create action log: ${error.message}`);
    }

    return data;
  }

  async completeActionLog(actionLogId: string, completedBy: string) {
    const { data, error } = await supabase
      .from('package_action_logs')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        completed_by: completedBy
      })
      .eq('id', actionLogId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to complete action log: ${error.message}`);
    }

    return data;
  }

  async getActionLogs(packageId: string) {
    // First verify package exists
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    const { data, error } = await supabase
      .from('package_action_logs')
      .select(`
        *,
        uploaded_by_user:users!package_action_logs_uploaded_by_fkey(name, email),
        completed_by_user:users!package_action_logs_completed_by_fkey(name, email)
      `)
      .eq('package_id', packageData.id)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to get action logs: ${error.message}`);
    }

    return data;
  }

  async deleteActionLog(actionLogId: string) {
    const { error } = await supabase
      .from('package_action_logs')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', actionLogId);

    if (error) {
      throw new BadRequestException(`Failed to delete action log: ${error.message}`);
    }

    return { success: true };
  }
}
