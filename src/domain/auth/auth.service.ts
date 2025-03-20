import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserLoginRequestDTO } from 'domain/auth/dtos/request/UserLogin.request.dto';
import { Provider, User } from 'domain/users/entities/user.entity';
import { UsersService } from 'domain/users/users.service';
import { Errors } from 'common/errors/Errors';
import { ConfigService } from '@nestjs/config';
import { SocialRequest } from 'domain/auth/passport/payloads/social.request';
import { RefreshRequestDTO } from 'domain/auth/dtos/request/Refresh.request.dto';
import { PatchCertificationDTO } from 'domain/auth/dtos/request/PatchCertification.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async jwtLogin(email: UserLoginRequestDTO['email'], password: UserLoginRequestDTO['password']) {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email,
          provider: Provider.Local,
        },
      });

      if (!user) {
        throw new HttpException(Errors.User['EMAIL_NOT_FOUND'], HttpStatus.NOT_FOUND);
      }

      const passwordValidated: boolean = await bcrypt.compare(password, user.password);

      if (!passwordValidated) {
        throw new HttpException(Errors.User['WRONG_PASSWORD'], HttpStatus.NOT_FOUND);
      }

      // const token = this.jwtService.sign({ email: email, id: user.id });

      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user.id);
      await this.usersService.saveRefreshtoken(user.id, refreshToken);

      const userInfo = await this.usersService.findUserById(user.id);


      return { accessToken, refreshToken, userInfo };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, 500);
    }
  }

  async recertification(userId: number, dto: PatchCertificationDTO) {
    const user = await this.usersRepository.findOne({
      where: {
        id: Equal(userId),
      },
    });

    try {
      await this.usersRepository.update({ id: userId }, { ...dto });
    } catch (err) {
      console.log(err);
      throw new HttpException('recertification failed', 500);
    }
  }

  async snsLogin(req: SocialRequest) {
    try {
      const {
        user: { email, provider },
      } = req;

      const user = await this.usersService.snsLoginOrResist({ email, provider });

      const accessToken = await this.createAccessToken(user);
      const refreshToken = await this.createRefreshToken(user.id);
      await this.usersService.saveRefreshtoken(user.id, refreshToken);
      const userInfo = await this.usersService.findUserById(user.id);

      return { accessToken, refreshToken, userInfo };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        Errors.Auth['SOCIAL_LOGIN_FAIL'],
        Errors.Auth['SOCIAL_LOGIN_FAIL'].code
      );
    }
  }

  createTokens(data: { email: string; id: number }): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(data, {
      secret: this.configService.get<string>('SECRET_KEY'),
    });

    const refreshToken = this.jwtService.sign(data, {
      secret: this.configService.get<string>('SECRET_KEY'),
    });

    return { accessToken, refreshToken };
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('ACCESS_EXPIRE_TIME'),
    });
  }

  async createRefreshToken(userId: number): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      {
        secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get<string>('REFRESH_EXPIRE_TIME'),
      }
    );
  }

  async refresh(dto: RefreshRequestDTO) {
    const { refreshToken } = dto;

    const decodeRefreshToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET_KEY'),
    });

    const userId = decodeRefreshToken.userId;
    const user = await this.getUserIfRefreshTokenMatches(userId, refreshToken);

    const accessToken = await this.createAccessToken(user);
    const newRefreshToken = await this.createRefreshToken(user.id);

    await this.usersService.saveRefreshtoken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async getUserIfRefreshTokenMatches(userId: number, refreshToken) {
    const user = await this.usersService.findUserById(userId);
    if (!user.refreshToken) {
      throw new HttpException(
        Errors.User['REFRESH_TOKEN_NOT_FOUND'],
        Errors.User['REFRESH_TOKEN_NOT_FOUND'].code
      );
    }

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenMatching) {
      throw new HttpException(
        Errors.User['REFRESH_TOKEN_NOT_MATCH'],
        Errors.User['REFRESH_TOKEN_NOT_MATCH'].code
      );
    }

    return user;
  }
}