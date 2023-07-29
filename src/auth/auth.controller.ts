import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from '../decorator/customize';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express'
import { IUser } from 'src/users/users.interface';
import { User } from '../decorator/customize'
@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService //
  ) {}
  @UseGuards(JwtAuthGuard)
  //bảo về người dùng : đăng nhập thì mới có thể truy cập vào route này
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
  
  
  @Get('account')
  getProfile(@User() user: IUser) {
    return {user};//req.user này là req mà jwt trả về 
  }
  @Public()
  @ResponseMessage("refresh token")
  @Get('refresh')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refresh_token"];//req.user này là req mà jwt trả về 
    return this.authService.processNewToken(refreshToken, response);//req.user này là req mà jwt
  }
  @Post('logout')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    response.clearCookie("refresh_token");
    return this.authService.logout(user, response);//req.user này là req mà jwt
  }
}
