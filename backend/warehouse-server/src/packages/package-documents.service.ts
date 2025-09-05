import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { PackageActionLogsService } from './package-action-logs.service';
import { DocumentUploadService } from '../shared/document-upload.service';

interface CreatePackageDocumentDto {
  name: string;
  type: string;
  url: string;
  size: number;
}

@Injectable()
export class PackageDocumentsService {
  constructor(
    private readonly actionLogsService: PackageActionLogsService,
    private readonly documentUploadService: DocumentUploadService
  ) {}
  async uploadDocuments(packageId: string, files: any[]) {
    // First verify package exists and get the actual package ID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    // Use the generic document upload service
    const result = await this.documentUploadService.uploadDocuments(files, {
      entityType: 'package',
      entityId: packageData.id,
      category: 'action_required',
      isRequired: true,
      uploadedBy: 'c051bbaf-b3ab-4d7f-b5cc-6511ce5ea40e' // TODO: Get from auth context
    });

    // Create action logs for each uploaded document
    for (const document of result.documents) {
      try {
        await this.actionLogsService.createActionLog({
          package_id: packageData.id,
          file_name: document.document_name,
          file_url: document.document_url,
          file_type: document.document_type,
          file_size: document.file_size,
          mime_type: document.mime_type,
          uploaded_by: document.uploaded_by
        });
      } catch (actionLogError) {
        console.error('Failed to create action log:', actionLogError);
        // Don't fail the upload if action log creation fails
      }
    }

    return result;
  }

  async createDocument(packageId: string, createDocumentDto: CreatePackageDocumentDto) {
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

    const documentData = {
      package_id: packageData.id,
      document_name: createDocumentDto.name,
      original_filename: createDocumentDto.name,
      document_url: createDocumentDto.url,
      document_type: createDocumentDto.type,
      file_size: createDocumentDto.size,
      mime_type: createDocumentDto.type === 'image' ? 'image/jpeg' : 'application/pdf',
      category: 'action_required',
      is_required: true,
      uploaded_by: 'c051bbaf-b3ab-4d7f-b5cc-6511ce5ea40e', // TODO: Get from auth context
    };

    const { data, error } = await supabase
      .from('package_documents')
      .insert(documentData)
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to create document: ${error.message}`);
    }

    return data;
  }

  async deleteDocument(packageId: string, documentId: string) {
    // First verify package exists and get the actual package ID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    // Use the generic document service
    return this.documentUploadService.deleteDocument('package', packageData.id, documentId);
  }

  async getDocuments(packageId: string) {
    // First verify package exists and get the actual package ID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(packageId);
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('id')
      .eq(isUUID ? 'id' : 'custom_package_id', packageId)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with id ${packageId} not found`);
    }

    // Use the generic document service
    return this.documentUploadService.getDocuments('package', packageData.id);
  }
}
