import { PickType } from '@nestjs/swagger';
import { UserDTO } from 'domain/users/dtos/User.dto';

export class EmailCheckRequestDTO extends PickType(UserDTO, ['email'] as const) {}