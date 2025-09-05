
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { PackageDocument } from '../packages/entities/package-document.entity';
import { Package } from '../packages/entities/package.entity';

export interface DocumentUploadOptions {
  entityType:
    | 'package'
    | 'user'
    | 'rack'
    | 'supplier'
    | 'pre-arrival'
    | 'pickup-request'
    | 'shopping-request';
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
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(PackageDocument)
    private readonly packageDocumentRepository: Repository<PackageDocument>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async uploadDocuments(
    files: any[],
    options: DocumentUploadOptions,
  ): Promise<{ documents: DocumentMetadata[] }> {
    // For now, only support package documents
    if (options.entityType !== 'package') {
      throw new BadRequestException(
        `Entity type ${options.entityType} not supported yet. Only 'package' is supported.`,
      );
    }

    // For packages, we need to handle custom package IDs
    let actualEntityId = options.entityId;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        options.entityId,
      );

    if (!isUUID) {
      // If it's a custom package ID, get the actual package ID first
      const packageData = await this.packageRepository.findOne({
        where: { package_id: options.entityId },
        select: ['id'],
      });

      if (!packageData) {
        throw new BadRequestException(
          `Package with id ${options.entityId} not found`,
        );
      }

      actualEntityId = packageData.id;
    }

    const documents: DocumentMetadata[] = [];

    for (const file of files) {
      try {
        // Validate file type
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error(
            `Invalid file type: ${file.mimetype}. Only images and PDFs are allowed.`,
          );
        }

        // Validate file size (10MB max as per your schema)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(
            `File too large: ${file.originalname}. Maximum size is 10MB.`,
          );
        }

        // Upload file to Cloudinary
        const folder = `warehouse/${options.entityType}/${options.entityId}`;
        const uploadResult = await this.cloudinaryService.uploadFile(
          file,
          folder,
        );

        // Save document record to database using TypeORM
        const packageDocument = this.packageDocumentRepository.create({
          package_id: actualEntityId,
          document_name: file.originalname,
          original_filename: file.originalname,
          document_url: uploadResult.secure_url,
          document_type: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
          file_size: file.size,
          mime_type: file.mimetype,
          category: options.category || 'general',
          is_required: options.isRequired || false,
          uploaded_by: options.uploadedBy,
        });

        const savedDocument = await this.packageDocumentRepository.save(packageDocument);

        // Convert to DocumentMetadata format
        const documentMetadata: DocumentMetadata = {
          id: savedDocument.id,
          document_name: savedDocument.document_name,
          original_filename: savedDocument.original_filename,
          document_url: savedDocument.document_url,
          document_type: savedDocument.document_type,
          file_size: savedDocument.file_size,
          mime_type: savedDocument.mime_type,
          category: savedDocument.category,
          is_required: savedDocument.is_required,
          uploaded_by: savedDocument.uploaded_by,
          uploaded_at: savedDocument.created_at.toISOString(),
        };

        documents.push(documentMetadata);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        throw new BadRequestException(
          `Failed to upload ${file.originalname}: ${error.message}`,
        );
      }
    }

    return { documents };
  }

  async getDocuments(
    entityType: string,
    entityId: string,
  ): Promise<DocumentMetadata[]> {
    // For now, only support package documents
    if (entityType !== 'package') {
      throw new BadRequestException(
        `Entity type ${entityType} not supported yet. Only 'package' is supported.`,
      );
    }

    // For packages, we need to handle custom package IDs
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        entityId,
      );

    if (!isUUID) {
      // If it's a custom package ID, get the actual package ID first
      const packageData = await this.packageRepository.findOne({
        where: { package_id: entityId },
        select: ['id'],
      });

      if (!packageData) {
        throw new BadRequestException(
          `Package with id ${entityId} not found`,
        );
      }

      entityId = packageData.id;
    }

    const documents = await this.packageDocumentRepository.find({
      where: { package_id: entityId },
      order: { created_at: 'DESC' },
    });

    return documents.map((document) => ({
      id: document.id,
      document_name: document.document_name,
      original_filename: document.original_filename,
      document_url: document.document_url,
      document_type: document.document_type,
      file_size: document.file_size,
      mime_type: document.mime_type,
      category: document.category,
      is_required: document.is_required,
      uploaded_by: document.uploaded_by,
      uploaded_at: document.created_at.toISOString(),
    }));
  }

  async deleteDocument(
    entityType: string,
    entityId: string,
    documentId: string,
  ): Promise<{ success: boolean }> {
    // For now, only support package documents
    if (entityType !== 'package') {
      throw new BadRequestException(
        `Entity type ${entityType} not supported yet. Only 'package' is supported.`,
      );
    }

    // For packages, we need to handle custom package IDs
    let actualEntityId = entityId;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        entityId,
      );

    if (!isUUID) {
      // If it's a custom package ID, get the actual package ID first
      const packageData = await this.packageRepository.findOne({
        where: { package_id: entityId },
        select: ['id'],
      });

      if (!packageData) {
        throw new BadRequestException(
          `Package with id ${entityId} not found`,
        );
      }

      actualEntityId = packageData.id;
    }

    // Get document to delete file from storage
    const document = await this.packageDocumentRepository.findOne({
      where: { id: documentId, package_id: actualEntityId },
      select: ['id', 'document_url'],
    });

    if (!document) {
      throw new BadRequestException(`Document with id ${documentId} not found`);
    }

    // Delete file from Cloudinary using the URL
    if (document.document_url) {
      try {
        const publicId = this.cloudinaryService.extractPublicId(
          document.document_url,
        );
        await this.cloudinaryService.deleteFile(publicId);
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
      }
    }

    // Soft delete document record using TypeORM
    await this.packageDocumentRepository.softDelete(documentId);

    return { success: true };
  }
}
