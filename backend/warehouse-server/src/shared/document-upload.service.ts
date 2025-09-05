import { Injectable, BadRequestException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';
import { CloudinaryService } from './cloudinary.service';

export interface DocumentUploadOptions {
  entityType: 'package' | 'user' | 'rack' | 'supplier' | 'pre-arrival' | 'pickup-request' | 'shopping-request';
  entityId: string;
  category?: string;
  isRequired?: boolean;
  uploadedBy: string;
  bucketName?: string;
}

export interface DocumentMetadata {
  id: string;
  document_name: string;
  original_filename: string;
  document_url: string;
  document_type: string;
  file_size: number;
  mime_type: string;
  category: string;
  is_required: boolean;
  uploaded_by: string;
  uploaded_at: string;
}

@Injectable()
export class DocumentUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  private getBucketName(entityType: string): string {
    // Use the single warehouse bucket for all documents
    return 'wearhouse_bucket';
  }

  private getTableName(entityType: string): string {
    const tableMap = {
      'package': 'package_documents',
      'user': 'user_documents',
      'rack': 'rack_documents',
      'supplier': 'supplier_documents',
      'pre-arrival': 'pre_arrival_documents',
      'pickup-request': 'pickup_request_documents',
      'shopping-request': 'shopping_request_documents'
    };
    return tableMap[entityType] || 'general_documents';
  }

  private getEntityIdField(entityType: string): string {
    return `${entityType}_id`;
  }

  async uploadDocuments(files: any[], options: DocumentUploadOptions): Promise<{ documents: DocumentMetadata[] }> {
    const bucketName = options.bucketName || this.getBucketName(options.entityType);
    const tableName = this.getTableName(options.entityType);
    const entityIdField = this.getEntityIdField(options.entityType);
    
    // For packages, we need to handle custom package IDs
    let actualEntityId = options.entityId;
    if (options.entityType === 'package') {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(options.entityId);
      
      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const { data: packageData, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('custom_package_id', options.entityId)
          .single();

        if (packageError || !packageData) {
          throw new BadRequestException(`Package with id ${options.entityId} not found`);
        }
        
        actualEntityId = packageData.id;
      }
    }
    
    const documents: DocumentMetadata[] = [];
    
    for (const file of files) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error(`Invalid file type: ${file.mimetype}. Only images and PDFs are allowed.`);
        }

        // Validate file size (10MB max as per your schema)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File too large: ${file.originalname}. Maximum size is 10MB.`);
        }

        // Upload file to Cloudinary
        const folder = `warehouse/${options.entityType}/${options.entityId}`;
        const uploadResult = await this.cloudinaryService.uploadFile(file, folder);

        // Save document record to database
        const documentData = {
          [entityIdField]: actualEntityId,
          document_name: file.originalname,
          original_filename: file.originalname,
          document_url: uploadResult.secure_url,
          document_type: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
          file_size: file.size,
          mime_type: file.mimetype,
          category: options.category || 'general',
          is_required: options.isRequired || false,
          uploaded_by: options.uploadedBy
          // Note: We'll store the Cloudinary public_id in a separate field if needed
        };

        const { data: document, error: documentError } = await supabase
          .from(tableName)
          .insert(documentData)
          .select()
          .single();

        if (documentError) {
          throw new Error(`Failed to save document record: ${documentError.message}`);
        }

        documents.push(document);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        throw new BadRequestException(`Failed to upload ${file.originalname}: ${error.message}`);
      }
    }

    return { documents };
  }

  async getDocuments(entityType: string, entityId: string): Promise<DocumentMetadata[]> {
    const tableName = this.getTableName(entityType);
    const entityIdField = this.getEntityIdField(entityType);

    // For packages, we need to handle custom package IDs
    if (entityType === 'package') {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityId);
      
      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const { data: packageData, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('custom_package_id', entityId)
          .single();

        if (packageError || !packageData) {
          throw new BadRequestException(`Package with id ${entityId} not found`);
        }
        
        entityId = packageData.id;
      }
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(entityIdField, entityId)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw new BadRequestException(`Failed to get documents: ${error.message}`);
    }

    return data;
  }

  async deleteDocument(entityType: string, entityId: string, documentId: string): Promise<{ success: boolean }> {
    const tableName = this.getTableName(entityType);
    const entityIdField = this.getEntityIdField(entityType);
    const bucketName = this.getBucketName(entityType);

    // For packages, we need to handle custom package IDs
    let actualEntityId = entityId;
    if (entityType === 'package') {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityId);
      
      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const { data: packageData, error: packageError } = await supabase
          .from('packages')
          .select('id')
          .eq('custom_package_id', entityId)
          .single();

        if (packageError || !packageData) {
          throw new BadRequestException(`Package with id ${entityId} not found`);
        }
        
        actualEntityId = packageData.id;
      }
    }

    // Get document to delete file from storage
    const { data: document, error: docError } = await supabase
      .from(tableName)
      .select('document_url')
      .eq('id', documentId)
      .eq(entityIdField, actualEntityId)
      .single();

    if (docError || !document) {
      throw new BadRequestException(`Document with id ${documentId} not found`);
    }

    // Delete file from Cloudinary using the URL
    if (document.document_url) {
      try {
        const publicId = this.cloudinaryService.extractPublicId(document.document_url);
        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
      }
    }

    // Soft delete document record
    const { error } = await supabase
      .from(tableName)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', documentId)
      .eq(entityIdField, actualEntityId);

    if (error) {
      throw new BadRequestException(`Failed to delete document: ${error.message}`);
    }

    return { success: true };
  }
}
