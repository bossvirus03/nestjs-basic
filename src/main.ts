import { NestFactory, Reflector } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public')); //static file
  app.setBaseViewsDir(join(__dirname, '..', 'views'));//view engine
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe()); //sử dụng pipe để validation dữ liệu
  const port = configService.get('PORT') ;
  await app.listen(port, ()=> {
    console.log(`this server listening on port ${port} ...`)
  });
}
bootstrap();
