import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentResponseDto> {
    const { uploaded_by, ...rest } = createDocumentDto;

    const document = this.documentRepository.create({
      ...rest,
      uploaded_by: { id: uploaded_by },
    });

    const saved = await this.documentRepository.save(document);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<DocumentResponseDto[]> {
    const docs = await this.documentRepository.find({
      order: { created_at: 'DESC' },
      relations: ['uploaded_by'],
    });
    return docs.map(this.toResponseDto);
  }

  async findOne(id: string): Promise<DocumentResponseDto> {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploaded_by'],
    });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return this.toResponseDto(doc);
  }

  async findByFeature(
    featureType: string,
    featureFid: string,
    category?: string,
  ): Promise<DocumentResponseDto[]> {
    const whereCondition: FindOptionsWhere<Document> = {
      feature_type: featureType as FeatureType,
      feature_fid: featureFid,
    };

    if (category) {
      whereCondition.category = category;
    }

    const docs = await this.documentRepository.find({
      where: whereCondition,
      order: { created_at: 'DESC' },
      relations: ['uploaded_by'],
    });
    return docs.map(this.toResponseDto);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    await this.documentRepository.remove(doc);
  }

  private toResponseDto = (doc: Document): DocumentResponseDto => ({
    id: doc.id,
    uploaded_by: doc.uploaded_by,
    feature_type: doc.feature_type,
    feature_fid: doc.feature_fid,
    document_name: doc.document_name,
    original_filename: doc.original_filename,
    document_url: doc.document_url,
    document_type: doc.document_type,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    category: doc.category,
    is_required: doc.is_required,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  });
}
