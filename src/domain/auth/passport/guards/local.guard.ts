import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Errors } from 'common/errors/Errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err || new HttpException(Errors.User['VALIDATE_FAIL'], Errors.User['VALIDATE_FAIL'].code)
      );
    }
    return user;
  }
}