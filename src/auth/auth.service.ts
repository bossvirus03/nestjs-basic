import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
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
        return {
            access_token: this.jwtService.sign(payload),
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
}