import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config/dist';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import {APP_GUARD} from '@nestjs/core'
import { CompaniesModule } from './companies/companies.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { JobsModule } from './jobs/jobs.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal : true //
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
