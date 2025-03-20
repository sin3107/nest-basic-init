import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Provider } from 'domain/users/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    console.log('✅ GOOGLE_CLIENT_ID:', configService.get<string>('GOOGLE_CLIENT_ID'));
    console.log('✅ GOOGLE_CLIENT_SECRET:', configService.get<string>('GOOGLE_CLIENT_SECRET'));
    console.log('✅ GOOGLE_CALLBACK_URL:', configService.get<string>('GOOGLE_CALLBACK_URL'));

    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) {
    try {
      const user = {
        email: profile.emails[0].value,
        provider: Provider.Google,
      };
      done(null, user);
    } catch (error) {
      console.log('에러 발생');
      done(error);
    }
  }
}
