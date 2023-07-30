import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    email: string;
    userId: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({
        message: "url không được để trống"
    })
    url: string;
    status: string;
    @IsNotEmpty({
        message: "companyId không được để trống"
    })
    companyId: string;
    @IsNotEmpty({
        message: "jobId không được để trống"
    })
    jobId: string;
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId;
            email: string;
        }
    }
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }
}
