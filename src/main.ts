import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { AppModule } from './app.module';
import * as expressSession from 'express-session';

import { AllExceptionsFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/sucess.interceptor';
import { winstonLogger } from './common/utils/logger/logger.config';

import { join } from 'path';
import * as morgan from 'morgan';


// 환경 변수 관리
const config = {
  isDevMode: process.env.NODE_ENV !== 'prod',
  port: process.env.PORT || '3000',
  corsOrigins: process.env.CORS_ORIGIN_LIST
    ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
    : ['*'],
  secretKey: process.env.SECRET_KEY || 'default_secret', // 기본값 추가
  adminUser: process.env.ADMIN_USER || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',
};

class Application {
  private logger = new Logger(Application.name);

  constructor(private server: NestExpressApplication) {
    if(!config.secretKey) {
      this.logger.error('Set "SECRET_KEY" env');
    }
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [config.adminUser]: config.adminPassword,
        },
      })
    );
  }

  private setUpOpenAPIMiddleware() {
    const config = new DocumentBuilder()
      .setTitle('Humanizone API')
      .setDescription('API for Humanizone server')
      .addBearerAuth()
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(this.server, config);
    SwaggerModule.setup('docs', this.server, document);
  }

  private async initializeApp() {
    this.server.enableCors({
      origin: config.corsOrigins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    this.server.use(cookieParser());
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();

    // ✅ 글로벌 설정을 하나의 배열로 정리 (가독성 향상)
    this.server.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
      new SuccessInterceptor()
    );
    this.server.useGlobalFilters(new AllExceptionsFilter());

    this.server.use(
      expressSession({
        secret: config.secretKey,
        resave: true,
        saveUninitialized: true,
      })
    );
    this.server.use(passport.initialize());
    this.server.use(passport.session());
    this.server.use(morgan('dev'));

    this.server.setBaseViewsDir(join(__dirname, '..', 'views'));
    this.server.useStaticAssets(join(__dirname, '..', 'public'));
    this.server.setViewEngine('hbs');
  }

  async bootstrap() {
    await this.initializeApp();
    await this.server.listen(config.port);
  }

  startLog() {
    this.logger.log(`Server started on http://localhost:${config.port}`);
  }

  errorLog(error: string) {
    this.logger.error(`Server error: ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});