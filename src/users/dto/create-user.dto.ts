//data transfer object
import { IsEmail, IsNotEmpty } from 'class-validator';//validator email, password, .. from class-validation
export class CreateUserDto {

    @IsEmail({}, { message: "định dạng này không phải email"})
    @IsNotEmpty({
        message: "email không được để trống"
    })
    email: string;
    @IsNotEmpty({
        message: "password không được để trống"
    })
    password: string;
    name: string;
}
