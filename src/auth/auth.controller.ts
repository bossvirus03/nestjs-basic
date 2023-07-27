import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from '../decorator/customize';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express'
@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService //
  ) {}
  @UseGuards(LocalAuthGuard)  
  @Public()
  @ResponseMessage("")
  @Post('login')
  async handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user,response);
  }
  
  @Public()
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);//req.user này là req mà jwt trả về 
  }
  
  @UseGuards(JwtAuthGuard)
  //bảo về người dùng : đăng nhập thì mới có thể truy cập vào route này
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;//req.user này là req mà jwt trả về 
  }
}
