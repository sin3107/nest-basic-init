import { PickType } from '@nestjs/swagger';
import { UserDTO } from 'domain/users/dtos/User.dto';

export class PatchCertificationDTO extends PickType(UserDTO, ['phone', 'name', 'birth']) {}