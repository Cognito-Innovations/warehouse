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
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PackageDocumentsService } from '../service/package-documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PackageDocumentResponseDto } from '../dto/package-document-response.dto';
import { CreatePackageDocumentDto as CreatePackageDocumentDtoImported } from '../dto/create-package-document.dto';

interface CreatePackageDocumentDto {
  name: string;
  type: string;
  url: string;
  size: number;
}

@ApiTags('Package Documents')
@Controller('packages/:package_id/documents')
@UseGuards(JwtAuthGuard)
export class PackageDocumentsController {
  constructor(
    private readonly packageDocumentsService: PackageDocumentsService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload multiple documents (images/PDFs)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Documents uploaded successfully',
    type: [PackageDocumentResponseDto],
  })
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
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.packageDocumentsService.uploadDocuments(package_id, files);
  }

  @Post()
  @ApiOperation({ summary: 'Create a document record' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiBody({ type: CreatePackageDocumentDtoImported })
  @ApiCreatedResponse({ type: PackageDocumentResponseDto })
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
  @ApiOperation({ summary: 'Delete a package document' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiParam({ name: 'documentId', example: 'doc-456' })
  @ApiOkResponse({ description: 'Document deleted successfully' })
  async deleteDocument(
    @Param('package_id') package_id: string,
    @Param('documentId') documentId: string,
  ) {
    return this.packageDocumentsService.deleteDocument(package_id, documentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents of a package' })
  @ApiParam({ name: 'package_id', example: 'pkg-123' })
  @ApiOkResponse({ type: [PackageDocumentResponseDto] })
  async getDocuments(@Param('package_id') package_id: string) {
    return this.packageDocumentsService.getDocuments(package_id);
  }
}
