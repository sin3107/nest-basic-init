import {
  Controller,
  Post,
  Body,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Errors } from 'common/errors/Errors';
import { SuccessResponse } from 'common/decorators/SuccessResponse.decorator';
import { ErrorResponse } from 'common/decorators/ErrorResponse.decorator';
import { UsersService } from 'domain/users/users.service';
import { UserSuccessDefine } from 'domain/users/responseDefines/userSuccess';
import { EmailCheckRequestDTO } from 'domain/users/dtos/request/EmailCheck.request.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('check-email')
  @ApiOperation({ summary: '이메일 중복 확인' })
  @ApiBody({ type: EmailCheckRequestDTO })
  @SuccessResponse(HttpStatus.OK, [UserSuccessDefine['User-S001']])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [
    Errors.User['DUPLICATED_EMAIL'],
    Errors.User['USER_NOT_FOUND'],
  ])

  async emailCheck(@Body() dto: EmailCheckRequestDTO) {
    const result = await this.usersService.findUserByEmail(dto['email']);
    if (result) {
      return { result: true };
    } else {
      return { result: false };
    }
  }
}