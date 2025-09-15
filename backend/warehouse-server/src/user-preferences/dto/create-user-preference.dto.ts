import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateUserPreferenceDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  courier_id: string;

  @IsUUID()
  @IsNotEmpty()
  currency_id: string;
}
