import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PackageDocumentsService } from '../service/package-documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


interface CreatePackageDocumentDto {
  name: string;
  type: string;
  url: string;
  size: number;
}



@Controller('packages/:package_id/documents')
@UseGuards(JwtAuthGuard)
export class PackageDocumentsController {
  constructor(
    private readonly packageDocumentsService: PackageDocumentsService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
        ];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type. Only images and PDFs are allowed.'),
            false,
          );
        }
      },
    }),
  )
  async uploadDocuments(
    @Param('package_id') package_id: string,
    @UploadedFiles() files: any[],
  ) {
    return this.packageDocumentsService.uploadDocuments(package_id, files);
  }

  @Post()
  async createDocument(
    @Param('package_id') package_id: string,
    @Body() createDocumentDto: CreatePackageDocumentDto,
  ) {
    return this.packageDocumentsService.createDocument(
      package_id,
      createDocumentDto,
    );
  }

  @Delete(':documentId')
  async deleteDocument(
    @Param('package_id') package_id: string,
    @Param('documentId') documentId: string,
  ) {
    return this.packageDocumentsService.deleteDocument(package_id, documentId);
  }

  @Get()
  async getDocuments(@Param('package_id') package_id: string) {
    return this.packageDocumentsService.getDocuments(package_id);
  }
}
