import mongoose from "mongoose";

//update kiểu dữ liệu của users
export interface IUser {
    _id: mongoose.Schema.Types.ObjectId
    name: string
    email: string
    role: {
        _id: string
        name: string
    }
    permissions:{
        _id: string
        name: string
        apiPath: string
        module: string
    }[]
    }