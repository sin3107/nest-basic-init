import { PickType } from '@nestjs/swagger';
import { UserDTO } from 'domain/users/dtos/User.dto';

export class RefreshRequestDTO extends PickType(UserDTO, ['refreshToken'] as const) {}