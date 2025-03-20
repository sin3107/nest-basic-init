import {
  Controller,
  Post,
  Body,
  Logger,
  HttpStatus,
  Get,
  UseGuards,
  HttpCode,
  Req,
  Res,
  Delete,
  Patch,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

import { Errors } from 'common/errors/Errors';
import { SuccessResponse } from 'common/decorators/SuccessResponse.decorator';
import { ErrorResponse } from 'common/decorators/ErrorResponse.decorator';
import { CurrentUser } from 'common/decorators/user.decorator';
import { JwtAuthGuard } from 'domain/auth/passport/guards/local.guard';
import { SocialRequest } from 'domain/auth/passport/payloads/social.request';
import { KakaoAuthGuard } from 'domain/auth/passport/guards/kakao.guard';
import { NaverAuthGuard } from 'domain/auth/passport/guards/naver.guard';
import { GoogleAuthGuard } from 'domain/auth/passport/guards/google.quard';
import { AppleAuthGuard } from 'domain/auth/passport/guards/apple.guard';

import { AuthService } from 'domain/auth/auth.service';
import { UsersService } from 'domain/users/users.service';

import { UserDTO } from 'domain/users/dtos/User.dto';

import { UserLoginRequestDTO } from 'domain/auth/dtos/request/UserLogin.request.dto';
import { UserRegisterRequestDTO } from 'domain/auth/dtos/request/UserRegister.request.dto';
import { UserRegisterResponseDTO } from 'domain/auth/dtos/response/UserRegister.response.dto';
import { UserLoginResponseDTO } from 'domain/auth/dtos/response/UserLogin.response.dto';
import { SocialLoginResponseDTO } from 'domain/auth/dtos/response/SocialLogin.response.dto';
import { RefreshRequestDTO } from 'domain/auth/dtos/request/Refresh.request.dto';
import { RefreshResponseDTO } from 'domain/auth/dtos/response/Refresh.response.dto';
import { PatchCertificationDTO } from 'domain/auth/dtos/request/PatchCertification.dto';

@ApiBearerAuth()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  // private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '토큰으로 유저 정보 가져오기' })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserDTO,
      exampleDescription: '토큰으로 유저 정보 가져온다',
      exampleTitle: '유저 정보 가져오기',
    },
  ])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [Errors.Common['INTERNAL_SERVER_ERROR']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [Errors.User['USER_NOT_FOUND']])
  async getUserInfo(@CurrentUser() user) {
    const userInfo = await this.usersService.findUserInfo(user.id);
    return userInfo;
  }

  @Post()
  @ApiOperation({ summary: '회원가입', description: '이메일과 비밀번호로 회원가입' })
  @ApiBody({ type: UserRegisterRequestDTO })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserRegisterResponseDTO,
      exampleDescription: '회원가입 성공 메시지',
      exampleTitle: ' 회원가입 성공',
    },
  ])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [Errors.Common['INTERNAL_SERVER_ERROR']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [Errors.User['EMAIL_ALREADY_EXIST']])
  async signUp(@Body() dto: UserRegisterRequestDTO) {
    return await this.usersService.registerUser(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'access token 재발급' })
  @ApiBody({ type: RefreshRequestDTO })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: RefreshResponseDTO,
      exampleDescription: 'refresh token으로 access token 재발급',
      exampleTitle: 'access token 재발급',
    },
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    Errors.User['REFRESH_TOKEN_NOT_FOUND'],
    Errors.User['REFRESH_TOKEN_NOT_MATCH'],
  ])
  async refresh(@Body() body: RefreshRequestDTO) {
    return await this.authService.refresh(body);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: UserLoginRequestDTO })
  @SuccessResponse(HttpStatus.OK, [
    {
      model: UserLoginResponseDTO,
      exampleDescription: '로그인 성공 메시지',
      exampleTitle: '로그인 성공',
    },
  ])
  @ErrorResponse(HttpStatus.NOT_FOUND, [
    Errors.User['USER_NOT_FOUND'],
    Errors.User['EMAIL_NOT_FOUND'],
  ])
  async login(@Body() dto: UserLoginRequestDTO) {
    return await this.authService.jwtLogin(dto.email, dto.password);
  }

  @Get('login/naver')
  @HttpCode(200)
  @ApiOperation({ summary: '네이버 로그인' })
  @UseGuards(NaverAuthGuard)
  async naverLogin(@Req() req: Request) {}

  @Get('login/naver/callback')
  @HttpCode(200)
  @ApiOperation({ summary: '네이버 로그인 콜백' })
  @UseGuards(NaverAuthGuard)
  @SuccessResponse(HttpStatus.OK, [
    {
      model: SocialLoginResponseDTO,
      exampleDescription: '성공시 access token 반환',
      exampleTitle: '네이버 로그인 콜백',
    },
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [Errors.Auth['SOCIAL_LOGIN_FAIL']])
  async naverLoginCallback(@Req() req: SocialRequest, @Res({ passthrough: true }) res: Response) {
    return await this.authService.snsLogin(req);
  }

  @Get('login/kakao')
  @HttpCode(200)
  @ApiOperation({ summary: '카카오 로그인' })
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req: Request) {}

  @Get('login/kakao/callback')
  @HttpCode(200)
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @UseGuards(KakaoAuthGuard)
  @SuccessResponse(HttpStatus.OK, [
    {
      model: SocialLoginResponseDTO,
      exampleDescription: '성공시 access token 반환',
      exampleTitle: '카카오 로그인 콜백',
    },
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [Errors.Auth['SOCIAL_LOGIN_FAIL']])
  async kakaoLoginCallback(@Req() req: SocialRequest, @Res({ passthrough: true }) res: Response) {
    return await this.authService.snsLogin(req);
  }

  @Get('login/google')
  @HttpCode(200)
  @ApiOperation({ summary: '구글 로그인' })
  @UseGuards(GoogleAuthGuard)
  async googleLogin(@Req() req: Request) {}

  @Get('login/google/callback')
  @HttpCode(200)
  @ApiOperation({ summary: '구글 로그인 콜백' })
  @UseGuards(GoogleAuthGuard)
  @SuccessResponse(HttpStatus.OK, [
    {
      model: SocialLoginResponseDTO,
      exampleDescription: '성공시 access token 반환',
      exampleTitle: '구글 로그인 콜백',
    },
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [Errors.Auth['SOCIAL_LOGIN_FAIL']])
  async googleLoginCallback(@Req() req: SocialRequest, @Res({ passthrough: true }) res: Response) {
    return await this.authService.snsLogin(req);
  }

  @Get('login/apple')
  @HttpCode(200)
  @ApiOperation({ summary: '애플 로그인' })
  @UseGuards(AppleAuthGuard)
  async appleLogin(@Req() req: Request) {}

  @Post('login/apple/callback')
  @HttpCode(200)
  @ApiOperation({ summary: '애플 로그인 콜백' })
  @UseGuards(AppleAuthGuard)
  @SuccessResponse(HttpStatus.OK, [
    {
      model: SocialLoginResponseDTO,
      exampleDescription: '성공시 access token 반환',
      exampleTitle: '애플 로그인 콜백',
    },
  ])
  @ErrorResponse(HttpStatus.FORBIDDEN, [Errors.Auth['SOCIAL_LOGIN_FAIL']])
  async appleLoginCallback(@Req() req: SocialRequest, @Res({ passthrough: true }) res: Response) {
    return await this.authService.snsLogin(req);
  }

  @Patch('recertification')
  @ApiOperation({ summary: '재인증' })
  @UseGuards(JwtAuthGuard)
  async recertification(@Body() dto: PatchCertificationDTO, @CurrentUser() user) {
    console.log('재인증 user', user);
    return await this.authService.recertification(user.id, dto);
  }
}