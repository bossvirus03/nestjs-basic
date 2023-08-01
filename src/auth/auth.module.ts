import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy'
import { AuthController } from './auth.controller';
import ms from 'ms';
import { UsersService } from 'src/users/users.service';
import { RolesModule } from 'src/roles/roles.module';
@Module({
  imports: [UsersModule, PassportModule,RolesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
            expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRES'))/1000,
        }
      }),
      inject: [ConfigService],
    }),],
  providers: [AuthService, LocalStrategy, JwtStrategy],// khi các router hoạt động thì module đã gọi đến các hàm của passport để check thông tin đăng nhập của user
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
