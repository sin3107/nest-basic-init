import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'domain/users/users.service';
import { JwtPayload } from 'domain/auth/passport/payloads/jwt.payload';
import { Errors } from 'common/errors/Errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findUserById(payload.id);

      if (user) {
        return user;
      } else {
        throw new HttpException(Errors.User['USER_NOT_FOUND'], Errors.User['USER_NOT_FOUND'].code);
      }
    } catch (error) {
      console.log(error);
    }
  }
}