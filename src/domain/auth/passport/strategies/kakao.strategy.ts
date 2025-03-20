import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import { UsersService } from 'domain/users/users.service';
import { Provider } from 'domain/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService, // ✅ 환경 변수 주입
  ) {
    console.log('KAKAO_CLIENT_ID:', configService.get<string>('KAKAO_CLIENT_ID')); // ✅ 로그 확인

    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'), // ✅ 변경
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
      scope: ['account_email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) {
    const {
      _json: {
        kakao_account: { email },
      },
    } = profile;

    try {
      const user = {
        email,
        provider: Provider.Kakao,
      };

      done(null, user);
    } catch (error) {
      console.log('에러 발생:', error);
      done(error);
    }
  }
}
