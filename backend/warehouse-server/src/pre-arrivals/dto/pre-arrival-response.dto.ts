export class PreArrivalResponseDto {
  id: string;
  user: string;
  suite: string;
  otp: number;
  tracking_no: string;
  estimate_arrival_time: string;
  details?: string;
  status: 'pending' | 'received';
  created_at: number;
  updated_at: number | null;
}
