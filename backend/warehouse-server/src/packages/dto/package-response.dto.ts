export class PackageResponseDto {
  id: string;
  customer: string;
  rack_slot: string;
  vendor: string;
  status: string;
  dangerous_good: boolean;
  created_by: string;
  custom_package_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export class PackageMeasurementResponseDto {
  id: string;
  package_id: string;
  piece_number: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  has_measurements: boolean;
  measurement_verified: boolean;
  created_at?: string;
  updated_at?: string;
}
