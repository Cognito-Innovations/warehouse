import { UserDto } from 'src/users/dto/user.dto';

export class AuthResponseDto {
  access_token: string;
  user?: UserDto;
}
