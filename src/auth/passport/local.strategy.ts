import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {//extends kế thừa
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {//vì ở đây đang dùng passportlocal nên chỉ có 2 tham số truyền vào là username và password
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("username/password is invalid");
    }
    return user;
  }
}