import { Controller, Post, Delete, Param, Get, UseInterceptors, UploadedFiles, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DocumentUploadService, DocumentUploadOptions } from './document-upload.service';

interface UploadDocumentsDto {
  category?: string;
  isRequired?: boolean;
  uploadedBy: string;
}

@Controller('documents/:entityType/:entityId')
export class DocumentUploadController {
  constructor(private readonly documentUploadService: DocumentUploadService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
      const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
      
      if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
      }
    }
  }))
  async uploadDocuments(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @UploadedFiles() files: any[],
    @Body() uploadDto: UploadDocumentsDto
  ) {
    const options: DocumentUploadOptions = {
      entityType: entityType as any,
      entityId,
      category: uploadDto.category,
      isRequired: uploadDto.isRequired,
      uploadedBy: uploadDto.uploadedBy
    };

    return this.documentUploadService.uploadDocuments(files, options);
  }

  @Get()
  async getDocuments(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ) {
    return this.documentUploadService.getDocuments(entityType, entityId);
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Param('documentId') documentId: string
  ) {
    return this.documentUploadService.deleteDocument(entityType, entityId, documentId);
  }
}
