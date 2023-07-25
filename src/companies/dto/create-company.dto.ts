//data transfer object
import { IsNotEmpty } from 'class-validator';//validator email, password, .. from class-validation
export class CreateCompanyDto {

    @IsNotEmpty({
        message: "email không được để trống"
    })
    email: string;
    @IsNotEmpty({
        message: "desciption không được để trống"
    })
    desciption: string;

    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;

    createdBy:{
        _id: string;
        _email: string;
    }
    
}
