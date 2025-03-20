import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'domain/auth/passport/payloads/jwt.payload';
import { UsersService } from 'domain/users/users.service';
import { UserStatus } from 'domain/users/entities/user.entity';
import { Errors } from 'common/errors/Errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookies]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('해당하는 유저가 없습니다');
      }

      return user;
    } catch (error) {
      throw new HttpException(error, 402);
    }
  }
}

export function isWithinOneMonth(d: Date) {
  const now = new Date();
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

  return d > oneMonthAgo;
}

export function isWithinOneYear(d: Date) {
  const now = new Date();
  const oneYearAgo = new Date(now.setMonth(now.getFullYear() - 1));

  return d > oneYearAgo;
}