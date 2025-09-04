import { Controller, Post, Delete, Body, Param, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PackageDocumentsService } from './package-documents.service';


interface CreatePackageDocumentDto {
  name: string;
  type: string;
  url: string;
  size: number;
}

@Controller('packages/:packageId/documents')
export class PackageDocumentsController {
  constructor(private readonly packageDocumentsService: PackageDocumentsService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images and PDFs are allowed.'), false);
      }
    }
  }))
  async uploadDocuments(
    @Param('packageId') packageId: string,
    @UploadedFiles() files: any[]
  ) {
    return this.packageDocumentsService.uploadDocuments(packageId, files);
  }

  @Post()
  async createDocument(
    @Param('packageId') packageId: string,
    @Body() createDocumentDto: CreatePackageDocumentDto
  ) {
    return this.packageDocumentsService.createDocument(packageId, createDocumentDto);
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('packageId') packageId: string,
    @Param('documentId') documentId: string
  ) {
    return this.packageDocumentsService.deleteDocument(packageId, documentId);
  }

  @Get()
  async getDocuments(@Param('packageId') packageId: string) {
    return this.packageDocumentsService.getDocuments(packageId);
  }
}
