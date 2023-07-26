//data transfer object
import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested, isNotEmpty } from 'class-validator';//validator email, password, .. from class-validation
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
class company {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;
}

export class RegisterUserDto {

    @IsEmail({}, { message: "định dạng này không phải email" })
    @IsNotEmpty({
        message: "email không được để trống"
    })
    email: string;

    @IsNotEmpty({
        message: "password không được để trống"
    })
    password: string;

    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;

    @IsNotEmpty({
        message: "address không được để trống"
    })
    address: string;

    @IsNotEmpty({
        message: "gender không được để trống"
    })
    gender: string;

    @IsNotEmpty({
        message: "age không được để trống"
    })
    age: number;

    rule: string;
}

export class CreateUserDto {

    @IsEmail({}, { message: "định dạng này không phải email" })
    @IsNotEmpty({
        message: "email không được để trống"
    })
    email: string;

    @IsNotEmpty({
        message: "password không được để trống"
    })
    password: string;

    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;

    @IsNotEmpty({
        message: "address không được để trống"
    })
    address: string;

    @IsNotEmpty({
        message: "rule không được để trống"
    })
    rule: string;

    @IsNotEmpty({
        message: "gender không được để trống"
    })
    gender: string;

    @IsNotEmpty({
        message: "age không được để trống"
    })
    age: number;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
    createdBy : {
        _id : mongoose.Schema.Types.ObjectId;
        email: string;
    }
    updatedBy : {
         _id : mongoose.Schema.Types.ObjectId;
        email: string;
    }
    DeletedBy : {
         _id : mongoose.Schema.Types.ObjectId;
        email: string;
    }
}