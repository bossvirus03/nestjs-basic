import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Company } from "src/companies/schemas/company.schema";
import { Job } from "src/jobs/schema/job.schema";
export type ResumeDocument = HydratedDocument<Resume>;
@Schema({
    timestamps: true,
})
export class Resume {
    @Prop()
    email: string;
    @Prop()
    userId: string;
    @Prop()
    url: string;
    @Prop()
    status: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    companyId: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
    jobId: string;
    @Prop({type: mongoose.Schema.Types.Array})
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: string;
            email: string;
        }
    }[];
    @Prop()
    isDeleted: boolean;
    @Prop()
    createdAt: Date;
    @Prop()
    updatedAt: Date;
    @Prop()
    deletedAt: Date;
    @Prop({type: Object})
    cteatedBy: {
        _id: string;
        email: string;
    }
    @Prop({type: Object})
    updatedBy: {
        _id: string;
        email: string;
    }
    @Prop({type: Object})
    deletedBy: {
        _id: string;
        email: string;
    }
}
export const ResumeSchema = SchemaFactory.createForClass(Resume);