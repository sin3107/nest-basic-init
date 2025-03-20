import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from 'domain/auth/auth.service';
import { AuthController } from 'domain/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'domain/users/entities/user.entity';

import { UsersModule } from 'domain/users/users.module';
import { LocalStrategy } from 'domain/auth/passport/strategies/local.strategy';
import { KakaoStrategy } from 'domain/auth/passport/strategies/kakao.strategy';
import { NaverStrategy } from 'domain/auth/passport/strategies/naver.strategy';
import { GoogleStrategy } from 'domain/auth/passport/strategies/google.strategy';
import { AppleStrategy } from 'domain/auth/passport/strategies/apple.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: +configService.get<number>('ACCESS_EXPIRE_TIME'),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
    AppleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}