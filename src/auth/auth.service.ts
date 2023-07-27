import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }
    //username, pass là 2 tham số thư viện passport nó trả về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user) {
            const isValid = this.usersService.checkUserPassword(pass, user.password)
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }
    async login(user: IUser) {
        const { _id, email, name } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,

        };
        const refresh_token = this.getRefreshToken(payload);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refresh_token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        };
    }
    async register(registerUserDto: RegisterUserDto) {
        const newUser = await this.usersService.register(registerUserDto)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }
    getRefreshToken  = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES'))/1000,

        });
        return refresh_token;
    }
}
