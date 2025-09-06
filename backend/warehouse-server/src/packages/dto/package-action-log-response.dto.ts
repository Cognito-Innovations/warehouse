export class PackageActionLogResponseDto {
  id: string;
  package_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  is_completed: boolean;
  completed_at?: Date;
  completed_by?: string;
  uploaded_at?: Date;
}
