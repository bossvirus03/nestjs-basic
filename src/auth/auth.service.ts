import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
    ) { }
    //username, pass là 2 tham số thư viện passport nó trả về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(username);
        if (user) {
            const isValid = this.usersService.checkUserPassword(pass, user.password)
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string
                name: string}
                const temp = await this.rolesService.findOne(userRole._id)
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions??[]
                }
             //   console.log(user)
                return objUser;
            }
        }
        return null;
    }
    async login(user: IUser, response: Response) {
        const { _id, email, name, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role,
            permissions
        };
        const refresh_token = this.getRefreshToken(payload);//create refresh token

        //update refresh token in database
        await this.usersService.updateUserToken(refresh_token, _id.toString())

        //set refresh token as cookie(lưu vào cookie)
        response.cookie('refresh_token', refresh_token,
            {
                httpOnly: true,
                maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES'))
            })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
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
    getRefreshToken = (payload) => {//create refresh token 
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES')) / 1000,

        });
        return refresh_token;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        //mỗi lần refresh trang sẽ cập nhật một refresh token mới và nó sẽ tồn tại trong thời gian set cookie
        try {
            //kiểm tra token trong db và cookie
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET')
            });
            
            const user = await this.usersService.findUserByToken(refreshToken)//tìm trong database xem có refresh token đã lưu ở phiên login
            if (user) {//nếu có thì cập nhật lại token
                const { _id, email, name, role} = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role,

                };
                const refresh_token = this.getRefreshToken(payload);//tạo ra 1 token mới (tồn tại trong thời gian ngắn)

                //khi đã đăng nhập, lúc gọi đến rout này sẽ cập nhập thêm trường refresh token vào data base
                await this.usersService.updateUserToken(refresh_token, _id.toString())

                const userRole = user.role as unknown as { _id: string
                    name: string}
                    const temp = await this.rolesService.findOne(userRole._id)

                //set refresh token as cookie(đặt refresh token vào cookie)
                response.clearCookie('refresh_token');//clear cookie cũ
                response.cookie('refresh_token', refresh_token,//thêm cookie mới
                    {
                        httpOnly: true,
                        maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRES'))//
                    })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp.permissions??[],
                    }
                };
            }
        } catch (error) {
            throw new BadRequestException("refresh token không hợp lệ hoặc đã hết hạn vui lòng đăng nhập lại")
            //khi không refresh lại trang trước khi refresh token hết hạn thì refresh token sẽ tự động hết hạn sau thời gian đã set (JWT_REFRESH_EXPIRES)
        };
    }
    logout = (user: IUser, response: Response) => {
        this.usersService.updateUserToken(null, user._id.toString())
        return "OK"
    }
}
