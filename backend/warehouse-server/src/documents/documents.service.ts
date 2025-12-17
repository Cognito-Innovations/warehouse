import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
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
    return plainToInstance(DocumentResponseDto, saved);
  }

  async findAll(): Promise<DocumentResponseDto[]> {
    const docs = await this.documentRepository.find({
      order: { created_at: 'DESC' },
      relations: ['uploaded_by'],
    });
    return plainToInstance(DocumentResponseDto, docs);
  }

  async findOne(id: string): Promise<DocumentResponseDto> {
    const doc = await this.documentRepository.findOne({
      where: { id },
      relations: ['uploaded_by'],
    });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return plainToInstance(DocumentResponseDto, doc);
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
    return plainToInstance(DocumentResponseDto, docs);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.documentRepository.findOne({ where: { id } });
    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    await this.documentRepository.remove(doc);
  }
}
