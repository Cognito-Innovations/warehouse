import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PackageActionLog } from '../entities';
import { CreatePackageActionLogDto } from '../dto/create-package-action-log.dto';
import { PackageActionLogResponseDto } from '../dto/package-action-log-response.dto';


@Injectable()
export class PackageActionLogsService {
  constructor(
    @InjectRepository(PackageActionLog)
    private readonly actionLogRepository: Repository<PackageActionLog>,
  ) {}

  async createActionLog(
    createActionLogDto: CreatePackageActionLogDto,
  ): Promise<PackageActionLogResponseDto> {
    const actionLog = this.actionLogRepository.create({
      ...createActionLogDto,
      is_completed: createActionLogDto.is_completed || false,
      uploaded_at: createActionLogDto.uploaded_at || new Date(),
    });

    const savedActionLog = await this.actionLogRepository.save(actionLog);

    return {
      id: savedActionLog.id,
      package_id: savedActionLog.package_id,
      file_name: savedActionLog.file_name,
      file_url: savedActionLog.file_url,
      file_type: savedActionLog.file_type,
      file_size: savedActionLog.file_size,
      mime_type: savedActionLog.mime_type,
      uploaded_by: savedActionLog.uploaded_by,
      is_completed: savedActionLog.is_completed,
      completed_at: savedActionLog.completed_at,
      completed_by: savedActionLog.completed_by,
      uploaded_at: savedActionLog.uploaded_at,
      created_at: savedActionLog.created_at,
      updated_at: savedActionLog.updated_at,
      deleted_at: savedActionLog.deleted_at,
    };
  }

  async completeActionLog(
    actionLogId: string,
    completedBy: string,
  ): Promise<PackageActionLogResponseDto> {
    const actionLog = await this.actionLogRepository.findOne({
      where: { id: actionLogId },
    });

    if (!actionLog) {
      throw new NotFoundException(`Action log with id ${actionLogId} not found`);
    }

    actionLog.is_completed = true;
    actionLog.completed_at = new Date();
    actionLog.completed_by = completedBy;

    const updatedActionLog = await this.actionLogRepository.save(actionLog);

    return {
      id: updatedActionLog.id,
      package_id: updatedActionLog.package_id,
      file_name: updatedActionLog.file_name,
      file_url: updatedActionLog.file_url,
      file_type: updatedActionLog.file_type,
      file_size: updatedActionLog.file_size,
      mime_type: updatedActionLog.mime_type,
      uploaded_by: updatedActionLog.uploaded_by,
      is_completed: updatedActionLog.is_completed,
      completed_at: updatedActionLog.completed_at,
      completed_by: updatedActionLog.completed_by,
      uploaded_at: updatedActionLog.uploaded_at,
      created_at: updatedActionLog.created_at,
      updated_at: updatedActionLog.updated_at,
      deleted_at: updatedActionLog.deleted_at,
    };
  }

  async getActionLogs(
    package_id: string,
  ): Promise<PackageActionLogResponseDto[]> {
    // First verify package exists - we'll need to inject Package repository for this
    // For now, we'll assume the package_id is valid and proceed
    const actionLogs = await this.actionLogRepository.find({
      where: { package_id: package_id },
      order: { uploaded_at: 'DESC' },
    });

    return actionLogs.map((log) => ({
      id: log.id,
      package_id: log.package_id,
      file_name: log.file_name,
      file_url: log.file_url,
      file_type: log.file_type,
      file_size: log.file_size,
      mime_type: log.mime_type,
      uploaded_by: log.uploaded_by,
      is_completed: log.is_completed,
      completed_at: log.completed_at,
      completed_by: log.completed_by,
      uploaded_at: log.uploaded_at,
      created_at: log.created_at,
      updated_at: log.updated_at,
      deleted_at: log.deleted_at,
    }));
  }

  async deleteActionLog(actionLogId: string): Promise<{ success: boolean }> {
    const actionLog = await this.actionLogRepository.findOne({
      where: { id: actionLogId },
    });

    if (!actionLog) {
      throw new NotFoundException(`Action log with id ${actionLogId} not found`);
    }

    await this.actionLogRepository.softDelete(actionLogId);

    return { success: true };
  }
}
