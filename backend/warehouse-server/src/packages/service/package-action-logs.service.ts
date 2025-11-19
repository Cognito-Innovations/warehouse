import { Injectable, NotFoundException } from '@nestjs/common';
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
      uploaded_at: createActionLogDto.uploaded_at
        ? Math.floor(new Date(createActionLogDto.uploaded_at).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
    });

    const savedActionLog = await this.actionLogRepository.save(actionLog);

    return savedActionLog;
  }

  async completeActionLog(
    actionLogId: string,
    completedBy: string,
  ): Promise<PackageActionLogResponseDto> {
    const actionLog = await this.actionLogRepository.findOne({
      where: { id: actionLogId },
    });

    if (!actionLog) {
      throw new NotFoundException(
        `Action log with id ${actionLogId} not found`,
      );
    }

    actionLog.is_completed = true;
    actionLog.completed_at = new Date();
    actionLog.completed_by = completedBy;

    const updatedActionLog = await this.actionLogRepository.save(actionLog);

    return updatedActionLog;
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
      ...log
    }));
  }

  async deleteActionLog(actionLogId: string): Promise<{ success: boolean }> {
    const actionLog = await this.actionLogRepository.findOne({
      where: { id: actionLogId },
    });

    if (!actionLog) {
      throw new NotFoundException(
        `Action log with id ${actionLogId} not found`,
      );
    }

    await this.actionLogRepository.softDelete(actionLogId);

    return { success: true };
  }
}
