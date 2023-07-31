import { IsNotEmpty } from "class-validator"

export class CreatePermissionDto {
    @IsNotEmpty({
        message: "name không đc để trống"
    })
    name: string
    @IsNotEmpty({
        message: "apiPath không đc để trống"
    })
    apiPath: string
    @IsNotEmpty({
        message: "method không đc để trống"
    })
    method: string
    @IsNotEmpty({
        message: "module không đc để trống"
    })
    module: string //thuộc modules nào ?
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    isDeleted: Date
    createdBy: {
        _id: String,
        email: String
    }
    updatedBy: {
        _id: String,
        email: String
    }
    deletedBy: {
        _id: String,
        email: String
    }

}
