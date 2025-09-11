import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  @ApiBody({ type: CreateDocumentDto })
  async create(
    @Body() createDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  async findAll(): Promise<DocumentResponseDto[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, type: DocumentResponseDto })
  async findOne(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentsService.findOne(id);
  }

  @Get('feature/:featureType/:featureFid')
  @ApiOperation({ summary: 'Get documents by feature type and feature ID' })
  @ApiParam({
    name: 'featureType',
    description: 'Type of feature (pickup-request, package, etc.)',
  })
  @ApiParam({ name: 'featureFid', description: 'Feature ID' })
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  async findByFeature(
    @Param('featureType') featureType: string,
    @Param('featureFid') featureFid: string,
  ): Promise<DocumentResponseDto[]> {
    return this.documentsService.findByFeature(featureType, featureFid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document by ID' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.documentsService.remove(id);
    return { message: 'Document deleted successfully' };
  }
}
