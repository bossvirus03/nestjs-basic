import mongoose from "mongoose";

//update kiểu dữ liệu của users
export interface ICompany {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    }