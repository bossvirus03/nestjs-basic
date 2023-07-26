import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from '../decorator/customize';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService //
  ) {}
  @UseGuards(LocalAuthGuard)  
  @Public()
  @Post('login')
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  
  @Public()
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);//req.user này là req mà jwt trả về 
  }
  
  @UseGuards(JwtAuthGuard)
  //bảo về người dùng : đăng nhập thì mới có thể truy cập vào route này
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;//req.user này là req mà jwt trả về 
  }
}
