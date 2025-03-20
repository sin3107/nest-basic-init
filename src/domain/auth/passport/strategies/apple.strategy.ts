import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from '@arendajaelu/nestjs-passport-apple';
import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'domain/users/users.service';
import { Provider } from 'domain/users/entities/user.entity';
import { Errors } from 'common/errors/Errors';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    console.log('✅ APPLE_CLIENT_ID:', configService.get<string>('APPLE_CLIENT_ID'));
    console.log('✅ APPLE_KEY:', configService.get<string>('APPLE_KEY'));
    console.log('✅ APPLE_KEY_ID:', configService.get<string>('APPLE_KEY_ID'));
    console.log('✅ APPLE_TEAM_ID:', configService.get<string>('APPLE_TEAM_ID'));

    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      key: configService.get<string>('APPLE_KEY').replace(/\\n/g, '\n'),
      scope: ['email', 'name'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) {
    try {
      if (!profile.emailVerified) {
        throw new HttpException(
          Errors.User['APPLE_USER_EMAIL_VERIFIED_FALSE'],
          Errors.User['APPLE_USER_EMAIL_VERIFIED_FALSE'].code
        );
      }

      const user = {
        email: profile.email,
        provider: Provider.Apple,
      };
      done(null, user);
    } catch (error) {
      console.log('에러 발생');
      done(error);
    }
  }
}
