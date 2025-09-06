export class PreArrivalResponseDto {
  id: string;
  customer: string;
  suite: string;
  otp: number;
  tracking_no: string;
  estimate_arrival_time: string;
  details?: string;
  status: 'pending' | 'received';
  created_at: Date;
  updated_at: Date | null;
}
