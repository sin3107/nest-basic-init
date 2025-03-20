import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { DataSource, Equal, Repository } from 'typeorm';
  import { ConfigService } from '@nestjs/config';
  import * as bcrypt from 'bcrypt';
  import { Errors } from 'common/errors/Errors';
  import { Provider, User } from 'domain/users/entities/user.entity';
  import { Profile } from 'domain/users/entities/profile.entity';

  import { UserRegisterRequestDTO } from 'domain/auth/dtos/request/UserRegister.request.dto';
  import { UserRegisterResponseDTO } from 'domain/auth/dtos/response/UserRegister.response.dto';
  
  
  @Injectable()
  export class UsersService {
    private readonly logger = new Logger(UsersService.name);
  
    constructor(
      @InjectRepository(User)
      private readonly usersRepository: Repository<User>,
      @InjectRepository(Profile)
      private readonly profileRepository: Repository<Profile>,
      private readonly dataSource: DataSource,
      private readonly configService: ConfigService,
    ) {}
  
    async registerUser(dto: UserRegisterRequestDTO): Promise<UserRegisterResponseDTO> {
      const { email, password } = dto;
      const user = await this.usersRepository.findOne({
        where: {
          email: email,
          provider: Provider.Local,
        },
      });
  
      if (user) {
        throw new UnauthorizedException('중복된 이메일입니다');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
  
      try {
        await queryRunner.startTransaction();
  
        const newUser = this.usersRepository.create({
          ...dto,
          password: hashedPassword,
        });
  
  
        await this.usersRepository.insert(newUser);

        await queryRunner.commitTransaction();
        return { message: 'success' };
      } catch (err) {
        console.log(err);
        await queryRunner.rollbackTransaction();
        throw new HttpException(err.response, 500);
      } finally {
        await queryRunner.release();
      }
    }
  
    async snsLoginOrResist(dto: { email: string; provider: Provider }): Promise<User> {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
  
      try {
        await queryRunner.startTransaction();
        let user = await this.usersRepository.findOne({
          where: { email: Equal(dto.email), provider: dto.provider },
        });
  
        if (!user) {
          user = this.usersRepository.create({
            ...dto,
          });

        }
        await queryRunner.commitTransaction();
        return user;
      } catch (err) {
        console.log(err);
        await queryRunner.rollbackTransaction();
        throw new HttpException(
          Errors.Auth['SOCIAL_SIGNUP_FAIL'],
          Errors.Auth['SOCIAL_SIGNUP_FAIL'].code
        );
      } finally {
        await queryRunner.release();
      }
    }
  
  
    async saveRefreshtoken(userId: number, refreshToken: string) {
      const currentRefreshToken = await this.getCurrentRefreshToken(refreshToken);
      const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
      await this.usersRepository.update(userId, {
        refreshToken: currentRefreshToken,
        refreshExp: currentRefreshTokenExp,
      });
    }
  
    async getCurrentRefreshToken(refreshToken: string) {
      return await bcrypt.hash(refreshToken, 10);
    }
  
    async getCurrentRefreshTokenExp(): Promise<Date> {
      const currentDate = new Date();
      return new Date(
        currentDate.getTime() + parseInt(this.configService.get<string>('REFRESH_EXPIRE_TIME'))
      );
    }
  
    async findUserByEmail(email: string): Promise<User> {
      try {
        const user = await this.usersRepository.findOne({
          where: {
            email,
          },
        });
  
        if (!user) return null;
        return user;
      } catch (error) {
        throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다');
      }
    }
  
    async findUserById(id: number): Promise<User> {
      try {
        const user = await this.usersRepository.findOne({
          where: {
            id,
          },
        });
        if (!user)
          throw new HttpException(Errors.User['USER_NOT_FOUND'], Errors.User['USER_NOT_FOUND'].code);
  
        return user;
      } catch (err) {
        console.log(err);
        throw new HttpException(Errors.User['USER_NOT_FOUND'], 500);
      }
    }
  
  
    async findUserInfo(id: number): Promise<User> {
      try {
        const userInfo = await this.usersRepository.findOne({
          where: { id },
        });
  
        if (!userInfo)
          throw new HttpException(Errors.User['USER_NOT_FOUND'], Errors.User['USER_NOT_FOUND'].code);
  
        return userInfo;
      } catch (error) {
        console.log(error.message);
        throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다');
      }
    }
  
  }