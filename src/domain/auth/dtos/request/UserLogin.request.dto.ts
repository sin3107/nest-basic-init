import { PickType } from '@nestjs/swagger';
import { UserDTO } from 'domain/users/dtos/User.dto';

export class UserLoginRequestDTO extends PickType(UserDTO, ['email', 'password'] as const) {}