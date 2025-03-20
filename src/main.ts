import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';  // ✅ 추가
import * as expressBasicAuth from 'express-basic-auth';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import * as morgan from 'morgan';
import { join } from 'path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './common/interceptors/sucess.interceptor';
import { winstonLogger } from './common/utils/logger/logger.config';

class Application {
  private logger = new Logger(Application.name);

  constructor(private server: NestExpressApplication, private configService: ConfigService) {
    if (!this.configService.get<string>('SECRET_KEY')) {
      this.logger.error('Set "SECRET_KEY" in environment variables');
    }
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.configService.get<string>('ADMIN_USER', 'admin')]: this.configService.get<string>('ADMIN_PASSWORD', 'password'),
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
      origin: this.configService.get<string>('CORS_ORIGIN_LIST', '*').split(',').map((origin) => origin.trim()),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    this.server.use(cookieParser());
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();

    this.server.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
      new SuccessInterceptor()
    );
    this.server.useGlobalFilters(new AllExceptionsFilter());

    this.server.use(
      expressSession({
        secret: this.configService.get<string>('SECRET_KEY', 'default_secret'),
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
    await this.server.listen(this.configService.get<string>('PORT', '3000'));
  }

  startLog() {
    this.logger.log(`🚀 Server started on http://localhost:${this.configService.get<string>('PORT', '3000')}`);
  }

  errorLog(error: string) {
    this.logger.error(`❌ Server error: ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  const configService = server.get(ConfigService); // ✅ ConfigService 가져오기

  const app = new Application(server, configService);
  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
