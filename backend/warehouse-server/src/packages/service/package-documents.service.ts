import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PackageDocument } from '../entities';
import { PackageActionLogsService } from './package-action-logs.service';
import { DocumentUploadService } from 'src/shared/document-upload.service';
import { CreatePackageDocumentDto } from '../dto/create-package-document.dto';
import { PackageDocumentResponseDto } from '../dto/package-document-response.dto';


@Injectable()
export class PackageDocumentsService {
  constructor(
    @InjectRepository(PackageDocument)
    private readonly packageDocumentRepository: Repository<PackageDocument>,
    private readonly actionLogsService: PackageActionLogsService,
    private readonly documentUploadService: DocumentUploadService,
  ) {}
  async uploadDocuments(package_id: string, files: any[]) {
    // Use the generic document upload service
    const result = await this.documentUploadService.uploadDocuments(files, {
      entityType: 'package',
      entityId: package_id,
      category: 'action_required',
      isRequired: true,
      uploadedBy: 'c051bbaf-b3ab-4d7f-b5cc-6511ce5ea40e', // TODO: Get from auth context
    });

    // Create action logs for each uploaded document
    for (const document of result.documents) {
      try {
        await this.actionLogsService.createActionLog({
          package_id: package_id,
          file_name: document.document_name,
          file_url: document.document_url,
          file_type: document.document_type,
          file_size: document.file_size,
          mime_type: document.mime_type,
          uploaded_by: document.uploaded_by,
        });
      } catch (actionLogError) {
        console.error('Failed to create action log:', actionLogError);
        // Don't fail the upload if action log creation fails
      }
    }

    return result;
  }

  async createDocument(
    package_id: string,
    createDocumentDto: CreatePackageDocumentDto,
  ): Promise<PackageDocumentResponseDto> {
    const packageDocument = this.packageDocumentRepository.create({
      package_id: package_id,
      document_name: createDocumentDto.name,
      original_filename: createDocumentDto.name,
      document_url: createDocumentDto.url,
      document_type: createDocumentDto.type,
      file_size: createDocumentDto.size,
      mime_type:
        createDocumentDto.type === 'image' ? 'image/jpeg' : 'application/pdf',
      category: 'action_required',
      is_required: true,
      uploaded_by: 'c051bbaf-b3ab-4d7f-b5cc-6511ce5ea40e', // TODO: Get from auth context
    });

    const savedDocument =
      await this.packageDocumentRepository.save(packageDocument);

    return {
      id: savedDocument.id,
      package_id: savedDocument.package_id,
      document_name: savedDocument.document_name,
      original_filename: savedDocument.original_filename,
      document_url: savedDocument.document_url,
      document_type: savedDocument.document_type,
      file_size: savedDocument.file_size,
      mime_type: savedDocument.mime_type,
      category: savedDocument.category,
      is_required: savedDocument.is_required,
      uploaded_by: savedDocument.uploaded_by,
      created_at: savedDocument.created_at,
      updated_at: savedDocument.updated_at,
      deleted_at: savedDocument.deleted_at,
    };
  }

  async deleteDocument(
    package_id: string,
    documentId: string,
  ): Promise<{ success: boolean }> {
    const packageDocument = await this.packageDocumentRepository.findOne({
      where: { id: documentId, package_id: package_id },
    });

    if (!packageDocument) {
      throw new NotFoundException(`Document with id ${documentId} not found`);
    }

    await this.packageDocumentRepository.softDelete(documentId);

    return { success: true };
  }

  async getDocuments(package_id: string): Promise<PackageDocumentResponseDto[]> {
    const documents = await this.packageDocumentRepository.find({
      where: { package_id: package_id },
      order: { created_at: 'DESC' },
    });

    return documents.map((document) => ({
      id: document.id,
      package_id: document.package_id,
      document_name: document.document_name,
      original_filename: document.original_filename,
      document_url: document.document_url,
      document_type: document.document_type,
      file_size: document.file_size,
      mime_type: document.mime_type,
      category: document.category,
      is_required: document.is_required,
      uploaded_by: document.uploaded_by,
      created_at: document.created_at,
      updated_at: document.updated_at,
      deleted_at: document.deleted_at,
    }));
  }
}
