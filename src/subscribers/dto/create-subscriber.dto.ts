import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateSubscriberDto {
    @IsNotEmpty({message: "email không được để trống"})
    @IsEmail({},{message: "email không đúng định dạng"})
    email: string;
    @IsNotEmpty({message: "name không được để trống"})
    name : string;
    @IsArray({message: "skills có định dạng là array"})
    @IsNotEmpty({message: "skills không được để trống"})
    @IsString({each: true, message: "skill có dạnh string"})
    skills: mongoose.Schema.Types.Array[]
}
