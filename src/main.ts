import { NestFactory, Reflector } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  //config cors
  app.enableCors({
    origin: true,//cho phép các domain có cùng origin kết nối tới vd: 'http://localhost' kết nối tới 'http://localhost'
    credentials: true//cho phép frontend nhận cookie từ phía server
  });
  //set global JWT auth Gaurd
  app.useGlobalGuards(new JwtAuthGuard(reflector));

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

  //run server
  const port = configService.get('PORT');
  await app.listen(port, () => {
    console.log(`this server listening on port ${port} ...`)
  });
}
bootstrap();
