import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Provider } from 'domain/users/entities/user.entity';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    console.log('✅ NAVER_CLIENT_ID:', configService.get<string>('NAVER_CLIENT_ID'));
    console.log('✅ NAVER_CLIENT_SECRET:', configService.get<string>('NAVER_CLIENT_SECRET'));
    console.log('✅ NAVER_CALLBACK_URL:', configService.get<string>('NAVER_CALLBACK_URL'));

    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_CALLBACK_URL'),
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
      const { email } = profile;
      const user = {
        email,
        provider: Provider.Naver,
      };
      done(null, user);
    } catch (error) {
      console.log('에러 발생');
      done(error);
    }
  }
}
