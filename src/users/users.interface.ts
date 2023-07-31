import mongoose from "mongoose";

//update kiểu dữ liệu của users
export interface IUser {
    _id: mongoose.Schema.Types.ObjectId
    name: string
    email: string
    age: number
    role: mongoose.Schema.Types.ObjectId
    }