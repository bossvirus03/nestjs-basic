import { NestFactory, Reflector } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  //truyền reflector vào customize message
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //static file
  app.useStaticAssets(join(__dirname, '..', 'public'));

  //view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  //sử dụng pipe để validation dữ liệu
  app.useGlobalPipes(new ValidationPipe());

  //config versioning
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });
  //config cookies
  app.use(cookieParser());
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`this server listening on port ${port} ...`)
  });
}
bootstrap();
