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
  uploaded_at: number;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
}

export class DocumentMetadataDto {
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
  uploaded_at: number;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
}

export class DocumentUploadResponseDto {
  documents: DocumentMetadataDto[];
}

export class DocumentDeleteResponseDto {
  success: boolean;
}
