import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from 'domain/users/dtos/User.dto';

export class UserRegisterRequestDTO extends PickType(UserDTO, [
  'email',
  'password',
  'name',
  'birth',
  'phone',
] as const) {}