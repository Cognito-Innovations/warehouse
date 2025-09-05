import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { Package } from '../packages/package.entity';
import {
  UserDocument,
  RackDocument,
  SupplierDocument,
  PreArrivalDocument,
  PickupRequestDocument,
  ShoppingRequestDocument,
} from './entities';
import { PackageDocument } from '../packages/entities/package-document.entity';
import {
  DocumentUploadOptions,
  DocumentMetadataDto,
  DocumentUploadResponseDto,
  DocumentDeleteResponseDto,
} from './dto';

// Re-export types from DTOs for backward compatibility
export type { DocumentUploadOptions, DocumentMetadata } from './dto';

@Injectable()
export class DocumentUploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PackageDocument)
    private readonly packageDocumentRepository: Repository<PackageDocument>,
    @InjectRepository(UserDocument)
    private readonly userDocumentRepository: Repository<UserDocument>,
    @InjectRepository(RackDocument)
    private readonly rackDocumentRepository: Repository<RackDocument>,
    @InjectRepository(SupplierDocument)
    private readonly supplierDocumentRepository: Repository<SupplierDocument>,
    @InjectRepository(PreArrivalDocument)
    private readonly preArrivalDocumentRepository: Repository<PreArrivalDocument>,
    @InjectRepository(PickupRequestDocument)
    private readonly pickupRequestDocumentRepository: Repository<PickupRequestDocument>,
    @InjectRepository(ShoppingRequestDocument)
    private readonly shoppingRequestDocumentRepository: Repository<ShoppingRequestDocument>,
  ) {}
  private getBucketName(_entityType: string): string {
    // Use the single warehouse bucket for all documents
    return 'wearhouse_bucket';
  }

  private getTableName(entityType: string): string {
    const tableMap = {
      package: 'package_documents',
      user: 'user_documents',
      rack: 'rack_documents',
      supplier: 'supplier_documents',
      'pre-arrival': 'pre_arrival_documents',
      'pickup-request': 'pickup_request_documents',
      'shopping-request': 'shopping_request_documents',
    };
    return tableMap[entityType] || 'general_documents';
  }

  private getEntityIdField(entityType: string): string {
    return `${entityType}_id`;
  }

  private getDocumentRepository(entityType: string): Repository<any> {
    const repositoryMap = {
      package: this.packageDocumentRepository,
      user: this.userDocumentRepository,
      rack: this.rackDocumentRepository,
      supplier: this.supplierDocumentRepository,
      'pre-arrival': this.preArrivalDocumentRepository,
      'pickup-request': this.pickupRequestDocumentRepository,
      'shopping-request': this.shoppingRequestDocumentRepository,
    };
    return repositoryMap[entityType];
  }

  async uploadDocuments(
    files: any[],
    options: DocumentUploadOptions,
  ): Promise<DocumentUploadResponseDto> {
    const entityIdField = this.getEntityIdField(options.entityType);
    const documentRepository = this.getDocumentRepository(options.entityType);

    // For packages, we need to handle custom package IDs
    let actualEntityId = options.entityId;
    if (options.entityType === 'package') {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          options.entityId,
        );

      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const packageData = await this.packageRepository.findOne({
          where: { custom_package_id: options.entityId },
          select: ['id'],
        });

        if (!packageData) {
          throw new BadRequestException(
            `Package with id ${options.entityId} not found`,
          );
        }

        actualEntityId = packageData.id;
      }
    }

    const documents: DocumentMetadataDto[] = [];

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
          uploaded_by: options.uploadedBy,
        };

        const document = await documentRepository.save(documentData);
        documents.push(document as DocumentMetadataDto);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new BadRequestException(
          `Failed to upload ${file.originalname}: ${errorMessage}`,
        );
      }
    }

    return { documents };
  }

  async getDocuments(
    entityType: string,
    entityId: string,
  ): Promise<DocumentMetadataDto[]> {
    const entityIdField = this.getEntityIdField(entityType);
    const documentRepository = this.getDocumentRepository(entityType);

    // For packages, we need to handle custom package IDs
    if (entityType === 'package') {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          entityId,
        );

      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const packageData = await this.packageRepository.findOne({
          where: { custom_package_id: entityId },
          select: ['id'],
        });

        if (!packageData) {
          throw new BadRequestException(
            `Package with id ${entityId} not found`,
          );
        }

        entityId = packageData.id;
      }
    }

    const documents = await documentRepository.find({
      where: {
        [entityIdField]: entityId,
        deleted_at: null,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return documents as DocumentMetadataDto[];
  }

  async deleteDocument(
    entityType: string,
    entityId: string,
    documentId: string,
  ): Promise<DocumentDeleteResponseDto> {
    const entityIdField = this.getEntityIdField(entityType);
    const documentRepository = this.getDocumentRepository(entityType);

    // For packages, we need to handle custom package IDs
    let actualEntityId = entityId;
    if (entityType === 'package') {
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          entityId,
        );

      if (!isUUID) {
        // If it's a custom package ID, get the actual package ID first
        const packageData = await this.packageRepository.findOne({
          where: { custom_package_id: entityId },
          select: ['id'],
        });

        if (!packageData) {
          throw new BadRequestException(
            `Package with id ${entityId} not found`,
          );
        }

        actualEntityId = packageData.id;
      }
    }

    // Get document to delete file from storage
    const document = await documentRepository.findOne({
      where: {
        id: documentId,
        [entityIdField]: actualEntityId,
      },
      select: ['document_url'],
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

    // Soft delete document record
    await documentRepository.softDelete({
      id: documentId,
      [entityIdField]: actualEntityId,
    });

    return { success: true };
  }
}
