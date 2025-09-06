export class PackageDocumentResponseDto {
  id: string;
  package_id: string;
  document_name: string;
  original_filename: string;
  document_url: string;
  document_type: string;
  file_size: number;
  mime_type: string;
  category: string;
  is_required: boolean;
  uploaded_by: string;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
}
