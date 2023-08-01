import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string
    @IsNotEmpty({
        message: "desciption không được để trống"
    })
    description: string;
    @IsBoolean({message: "is Active co dinh dang laf boolean"})
    isActive: boolean;
    @IsNotEmpty({message: "isAtive không được để trống"})
    @IsMongoId({each: true, message: ""})
    @IsArray({message: "permission co dinh dang la array"})
    permissions: mongoose.Schema.Types.ObjectId[];
    updatedAt: Date;
    createdAt: Date;
    deletedAt: Date;
    isDeleted: boolean;
    createdBy: { _id: string, email: string };
    updatedBy: { _id: string, email: string };
    deletedBy: { _id: string, email: string };
}