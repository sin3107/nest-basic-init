import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'domain/users/users.service';
import { JwtPayload } from 'domain/auth/passport/payloads/jwt.payload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
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

  async validate(req, payload: JwtPayload) {
    try {
      const user = await this.usersService.findUserById(payload.id);
      if (user) {
        return user;
      } else {
        throw new UnauthorizedException('해당하는 유저가 없습니다');
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}