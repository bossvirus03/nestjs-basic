import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    email: string;
    userId: string;
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
            _id: string;
            email: string;
        }
    }[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: {
        _id: string;
        email: string;
    }
    updatedBy: {
        _id: string;
        email: string;
    }
    deletedBy: {
        _id: string;
        email: string;
    }
}
